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
import { useSessions } from '@/api';

const Sessions = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useSessions();
    console.log(data);
    if (isLoading) {
        return (
            <></>
        );
    }
    const sessions = data || [];
    const formatDate = (dateString: string) => {
        try {
            // Add 'Z' to indicate UTC/GMT
            const utcDate = new Date(dateString + 'Z');

            // Convert to local time
            const localDate = new Date(utcDate.getTime());

            return formatDistanceToNow(localDate, { addSuffix: true });
        } catch (error) {
            console.error('Error parsing date:', error);
            return dateString; // Fallback to original string if parsing fails
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'pending':
                return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
            default:
                return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/20';
        }
    };

    return (
        <div className="p-4">
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
                                        {session.created_at && formatDate(session.created_at)}
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
                            {sessions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No sessions found. Create a new session to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Sessions;