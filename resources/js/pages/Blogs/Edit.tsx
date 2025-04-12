import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    description: string;
    is_public: boolean;
}

interface FormData {
    title: string;
    description: string;
    is_public: boolean;
    [key: string]: string | boolean; // Add index signature
}

interface Errors {
    title?: string;
    description?: string;
    is_public?: string;
}

interface EditProps {
    blog: Blog;
}

export default function Edit({ blog }: EditProps) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    }: {
        data: FormData;
        setData: (key: keyof FormData, value: string | boolean) => void;
        put: (url: string) => void;
        processing: boolean;
        errors: Errors;
    } = useForm<FormData>({
        title: blog?.title,
        description: blog?.description,
        is_public: blog?.is_public,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('blogs.update', blog.id));
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
            <Head title={data.title} />
            <div className="max-w-7xl p-6">
                <form onSubmit={submit} className="mx-auto max-w-xl rounded-2xl border p-7">
                    <h1 className="flex items-center gap-1 text-3xl font-bold">
                        <Link href="/blogs">
                            <ArrowLeft />
                        </Link>
                        <span className="ml-2">Edit Blog</span>
                    </h1>
                    <div className="max-auto mt-6">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full rounded-md border border-gray-200 p-3 shadow-sm"
                            onChange={(e) => setData('description', e.target.value)}
                            required
                            rows={6}
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="is_public">Visibility</Label>
                        <select
                            id="is_public"
                            name="is_public"
                            value={data.is_public ? 'true' : 'false'}
                            className="mt-1 block w-full rounded-md border bg-gray-100 p-2"
                            onChange={(e) => setData('is_public', e.target.value === 'true')}
                        >
                            <option value="true">Public</option>
                            <option value="false">Private</option>
                        </select>
                        <InputError message={errors.is_public} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button disabled={processing}>Update Blog</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
