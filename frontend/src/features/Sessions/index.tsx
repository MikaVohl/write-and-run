import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, FileCode } from 'lucide-react';

interface Session {
    id: string;
    createdAt: string;
    language: string;
    status: 'completed' | 'failed' | 'processing';
    imageUrl: string;
}

const Sessions = () => {
    const navigate = useNavigate();

    // TODO: Replace with actual data fetching
    const sessions: Session[] = [
        {
            id: '1',
            createdAt: '2024-03-20T10:00:00Z',
            language: 'Python',
            status: 'completed',
            imageUrl: '/path/to/image'
        },
        // Add more mock data as needed
    ];

    const getStatusColor = (status: Session['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'failed':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
            case 'processing':
                return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
        }
    };

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Sessions</CardTitle>
                            <CardDescription>
                                View and manage your code analysis sessions
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2"
                        >
                            <FileCode className="w-4 h-4" />
                            New Session
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow
                                    key={session.id}
                                    className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    onClick={() => navigate(`/sessions/${session.id}`)}
                                >
                                    <TableCell className="font-medium">
                                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>{session.language}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/sessions/${session.id}`);
                                            }}
                                        >
                                            <span>View Details</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Sessions;