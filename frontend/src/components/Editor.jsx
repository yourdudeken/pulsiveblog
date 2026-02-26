import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost, uploadMedia } from '../utils/api';
import { Save, Image as ImageIcon, Loader2, FileCode2, Eye, LayoutTemplate } from 'lucide-react';
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
            setError('System requires a Title and Payload');
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
            setError(err.response?.data?.error || 'Target execution failed.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleMediaUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { url } = await uploadMedia(file);
            const markdownImage = `\n![${file.name}](${url})\n`;
            setContent((prev) => prev + markdownImage);
        } catch (err) {
            console.error('Buffer streaming failed:', err);
            setError('Object upload failed. Ensure payload < 50mb');
        }
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-14rem)] bg-[var(--background)]">
            {/* Editor Input Pipeline */}
            <motion.div
                layout
                className={`flex flex-col gap-4 ${isPreview ? 'hidden lg:flex w-1/2' : 'w-full'} h-full transition-all`}
            >
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Document Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-lg font-bold placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors text-white"
                    />

                    <input
                        type="text"
                        placeholder="Metadata Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors text-gray-300"
                    />
                </div>

                <div className="relative flex-1 flex flex-col w-full h-full min-h-[400px] structural-panel">
                    <div className="w-full border-b border-[var(--border-light)] py-2.5 px-4 flex justify-between items-center bg-[var(--background)] rounded-t-xl">
                        <span className="text-[11px] font-bold tracking-widest text-[#a1a1aa] uppercase flex items-center gap-2">
                            <FileCode2 size={14} /> RAW MARKDOWN
                        </span>
                        <div className="flex gap-4">
                            <label className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold">
                                <input type="file" accept="image/*" className="hidden" onChange={handleMediaUpload} />
                                <ImageIcon size={14} /> <span className="hidden sm:inline">Inject Media</span>
                            </label>

                            <button
                                onClick={() => setIsPreview(!isPreview)}
                                className="lg:hidden text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                            >
                                {isPreview ? <FileCode2 size={14} /> : <Eye size={14} />}
                                <span className="hidden sm:inline">Toggle View</span>
                            </button>
                        </div>
                    </div>

                    <textarea
                        className="w-full flex-1 bg-[var(--surface)] p-4 font-mono text-sm leading-[1.6] focus:outline-none resize-none transition-colors placeholder:text-gray-600 text-gray-300 rounded-b-xl border-none"
                        placeholder="Begin typing data stream..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-red-400 text-sm font-medium empty:hidden border border-red-900/50 bg-red-950/20 px-3 py-1.5 rounded-md">{error}</span>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto bg-white text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'Executing...' : 'Commit File'}
                    </button>
                </div>
            </motion.div>

            {/* Resolved Output Pipeline */}
            <AnimatePresence>
                {(isPreview || window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={`flex-1 h-full flex flex-col min-h-[400px] structural-panel ${!isPreview && window.innerWidth < 1024 ? 'hidden' : 'block'}`}
                    >
                        <div className="w-full border-b border-[var(--border-light)] py-2.5 px-4 flex items-center gap-2 bg-[var(--background)] rounded-t-xl">
                            <LayoutTemplate size={14} className="text-gray-400" />
                            <span className="text-[11px] font-bold tracking-widest text-[#a1a1aa] uppercase">Resolved Output</span>
                        </div>
                        <div className="w-full flex-1 rounded-b-xl p-8 overflow-y-auto bg-[var(--surface)]">
                            {content ? (
                                <div className="markdown-body prose prose-invert max-w-none">
                                    <Markdown>{content}</Markdown>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 font-medium gap-3">
                                    <LayoutTemplate size={32} className="opacity-20 text-gray-400" />
                                    <span className="text-sm">DOM will mount here...</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
