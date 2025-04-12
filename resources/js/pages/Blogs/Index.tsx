import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}
interface Like {
    user_id: number;
}
interface Blog {
    id: number;
    title: string;
    description: string;
    user_id: number;
    user: User;
    is_public: boolean;
    likes: Like[];
}
interface BlogsData {
    data: Blog[];
}
interface Filters {
    search?: string;
    author?: string;
    date?: string;
}
interface Auth {
    user: User;
}
interface IndexProps {
    blogs: BlogsData;
    filters: Filters;
    auth: Auth;
}

export default function Index({ blogs, filters, auth }: IndexProps) {
    const { get, post, delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');
    const [author, setAuthor] = useState(filters.author || '');
    const [date, setDate] = useState(filters.date || '');

    // Correctly typing likes state as a Record with number keys and number values
    const [likes, setLikes] = useState<Record<number, number>>(
        blogs.data.reduce(
            (acc, blog) => {
                acc[blog.id] = blog.likes.length;
                return acc;
            },
            {} as Record<number, number>,
        ),
    );

    const [notify, setNotify] = useState({ show: false, message: '' });

    const handleSearch = () => get(route('blogs.index', { search, author, date }), { preserveState: true, preserveScroll: true });

    const toggleLike = (blogId: number) => {
        const blog = blogs.data.find((blog) => blog.id === blogId);
        if (!blog) return;

        const hasLiked = blog.likes.some((like) => like.user_id === auth.user.id);
        const action = hasLiked ? destroy : post;
        const routeAction = hasLiked ? 'likes.destroy' : 'likes.store';

        action(route(routeAction, blogId), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setLikes((prev) => ({ ...prev, [blogId]: prev[blogId] + (hasLiked ? -1 : 1) }));
                setNotify({ show: true, message: `${hasLiked ? 'Unlike' : 'Like'} ${hasLiked ? 'removed' : 'added'} successfully!` });
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Blogs',
                    href: '/blogs',
                },
            ]}
        >
            <Head>
                <title>Blog Posts</title>
                <meta name="description" content="A list of blog posts." />
            </Head>
            <div className="max-w-7xl p-6">
                <h1 className="mb-6 text-3xl font-bold">Blog Posts</h1>
                <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
                    <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2 sm:mb-0" />
                    <Input placeholder="Filter by author" value={author} onChange={(e) => setAuthor(e.target.value)} className="mb-2 sm:mb-0" />
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2 sm:mb-0" />
                    <Button onClick={handleSearch} className="w-full sm:w-auto">
                        Search
                    </Button>
                    <Link
                        href={route('blogs.create')}
                        className="w-full shrink-0 rounded bg-blue-600 px-3 py-1 text-center text-white hover:bg-blue-700 sm:mt-0 sm:w-auto"
                    >
                        Create Blog
                    </Link>
                </div>

                <div className="grid gap-6">
                    {blogs.data.map((blog) => (
                        <div key={blog.id} className="rounded-lg border bg-white p-6 shadow">
                            <h2 className="text-xl font-semibold">{blog.title}</h2>
                            <p className="mt-2 text-gray-600">{blog.description.substring(0, 200)}...</p>
                            <p className="mt-2 text-sm text-gray-500">By {blog.user.name}</p>
                            <p className="text-sm text-gray-500">{blog.is_public ? 'Public' : 'Private'}</p>

                            <div className="mt-4 flex items-center space-x-4">
                                <button onClick={() => toggleLike(blog.id)} className="text-gray-500 hover:underline">
                                    {blog.likes.some((like) => like.user_id === auth.user.id) ? <Heart className="fill-gray-500" /> : <Heart />}
                                </button>
                                <span>{likes[blog.id]} Likes</span>
                            </div>

                            {blog.user_id === auth.user.id && (
                                <div className="mt-4 flex space-x-4">
                                    <Link href={route('blogs.edit', blog.id)} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => confirm('Are you sure?') && destroy(route('blogs.destroy', blog.id))}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <center className="p-5">{blogs.data.length === 0 && 'No blog posts found.'}</center>

                {notify.show && (
                    <div className="bg-opacity-1 fixed inset-0 z-[9999] flex items-center justify-center bg-gray-500">
                        <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
                            <p>{notify.message}</p>
                            <Button onClick={() => setNotify({ ...notify, show: false })} className="mt-4 w-full bg-blue-600 text-white">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
