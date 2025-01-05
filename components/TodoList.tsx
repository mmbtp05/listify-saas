import { LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCheckList, useDeleteList } from '@lib/hooks';
import { List } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { User } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from './Avatar';
import TimeInfo from './TimeInfo';

type Props = {
    value: List & { owner: User };
    deleted?: (value: List) => void;
};

export default function TodoList({ value }: Props) {
    const router = useRouter();

    // check if the current user can delete the list (based on its owner)
    const { data: canDelete } = useCheckList({ operation: 'delete', where: { ownerId: value.ownerId } });

    const { trigger: deleteList } = useDeleteList();

    const onDeleteList = () => {
        if (confirm('Are you sure to delete this list?')) {
            void deleteList({ where: { id: value.id } });
        }
    };

    return (
        <div className="card w-80 bg-white shadow-xl cursor-pointer hover:bg-gray-50">
            <Link href={`${router.asPath}/${value.id}`}>
                <figure>
                    <Image
                        src={`https://picsum.photos/300/200?r=${customAlphabet('0123456789')(4)}`}
                        className="rounded-t-2xl"
                        width={320}
                        height={200}
                        alt="Cover"
                    />
                </figure>
            </Link>
            <div className="card-body">
                <Link href={`${router.asPath}/${value.id}`}>
                    <h2 className="card-title line-clamp-1">{value.title || 'Missing Title'}</h2>
                </Link>
                <div className="card-actions flex w-full justify-between">
                    <div>
                        <TimeInfo value={value} />
                    </div>
                    <div className="flex space-x-2">
                        <Avatar user={value.owner} size={18} />
                        {value.private && (
                            <div className="tooltip" data-tip="Private">
                                <LockClosedIcon className="w-4 h-4 text-gray-500" />
                            </div>
                        )}

                        {canDelete && (
                            <TrashIcon
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                                onClick={() => {
                                    onDeleteList();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
