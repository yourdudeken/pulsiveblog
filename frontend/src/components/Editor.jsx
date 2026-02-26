import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost, uploadMedia } from '../utils/api';
import { Save, Image as ImageIcon, Loader2, FileCode2, Eye } from 'lucide-react';
import Markdown from 'markdown-to-jsx';

export default function Editor({ initialPost = null, onSaveSuccess }) {
    const [title, setTitle] = useState(initialPost?.title || '');
    const [tags, setTags] = useState(initialPost?.tags ? initialPost.tags.join(', ') : '');
    const [content, setContent] = useState(initialPost?.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!title || !content) {
            setError('Title and content are required');
            return;
        }
        setError('');
        setIsSaving(true);
        try {
            const payload = {
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (initialPost?.path) {
                await updatePost({ ...payload, path: initialPost.path });
            } else {
                await createPost(payload);
            }
            onSaveSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleMediaUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { url } = await uploadMedia(file);
            // Insert markdown directly into editor
            const markdownImage = `\n![${file.name}](${url})\n`;
            setContent((prev) => prev + markdownImage);
        } catch (err) {
            console.error('Media upload failed:', err);
            setError('Failed to upload media. Ensure size < 50mb');
        }
    };

    return (
        <div className="w-full flex gap-6 h-[calc(100vh-12rem)]">
            {/* Editor Panel */}
            <motion.div
                layout
                className={`flex flex-col gap-4 ${isPreview ? 'hidden lg:flex w-1/2' : 'w-full'} h-full transition-all`}
            >
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Post Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-[rgba(36,40,59,0.4)] border border-white/10 rounded-xl px-4 py-3 text-lg font-semibold placeholder:text-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-1/3 bg-[rgba(36,40,59,0.4)] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-[var(--secondary)] transition-all"
                    />
                </div>

                <div className="relative flex-1 group">
                    <textarea
                        className="w-full h-full bg-[rgba(36,40,59,0.4)] border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-[var(--primary)] resize-none transition-all placeholder:text-gray-500"
                        placeholder="Write your markdown here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <label className="cursor-pointer bg-[var(--surface)] hover:bg-[rgba(255,255,255,0.1)] p-2 rounded-lg border border-white/10 transition-colors flex items-center justify-center group/tooltip relative">
                            <input type="file" accept="image/*" className="hidden" onChange={handleMediaUpload} />
                            <ImageIcon size={18} className="text-[var(--secondary)]" />
                            <span className="absolute bottom-full mb-2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none">Upload Image {'->'} GitHub Contents</span>
                        </label>

                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="lg:hidden bg-[var(--surface)] hover:bg-[rgba(255,255,255,0.1)] p-2 rounded-lg border border-white/10 transition-colors text-[var(--accent)]"
                        >
                            {isPreview ? <FileCode2 size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-red-400 text-sm">{error}</span>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--background)] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Committing to GitHub...' : 'Save Post'}
                    </button>
                </div>
            </motion.div>

            {/* Live Preview Panel - Desktop dual pane, mobile toggle */}
            <AnimatePresence>
                {(isPreview || window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`flex-1 h-full flex flex-col ${!isPreview && window.innerWidth < 1024 ? 'hidden' : 'block'}`}
                    >
                        <div className="glass-panel w-full h-full rounded-xl p-8 overflow-y-auto">
                            {content ? (
                                <div className="markdown-body">
                                    <Markdown>{content}</Markdown>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 font-medium">
                                    Live Preview...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
