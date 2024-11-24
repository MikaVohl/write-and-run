import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { FileCode } from 'lucide-react';
import { useSessions } from '@/api';
import { getStatusColor } from '@/components/utils';

const Sessions = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useSessions();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

    if (isLoading) {
        return <></>;
    }

    const sessions = data || [];
    const languages = ['Java', 'Python', 'Bash', 'C'];

    const filteredSessions = selectedLanguage === 'all'
        ? sessions
        : sessions.filter(session => session.language?.toLowerCase() === selectedLanguage.toLowerCase());

    const capFirst = (string: string) => {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatDate = (dateString: string) => {
        try {
            const utcDate = new Date(dateString + 'Z');
            const localDate = new Date(utcDate.getTime());
            const distance = formatDistanceToNow(localDate, { addSuffix: true });
            return distance.replace(/minute(s)?/, 'mins').replace(/second(s)?/, 'sec').replace(/hour(s)?/, 'hr').replace(/day(s)?/, 'd');
        } catch (error) {
            console.error('Error parsing date:', error);
            return dateString;
        }
    };

    return (
        <div className="h-screen p-4">
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Sessions</CardTitle>
                            <CardDescription>
                                View and manage your code analysis sessions
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2"
                        >
                            <FileCode className="w-4 h-4" />
                            New Session
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="w-full">
                            <Table>
                                <TableHeader className="bg-white dark:bg-black">
                                    <TableRow>
                                        <TableHead className="w-[45%] h-10">Summary</TableHead>
                                        <TableHead className="w-[15%] h-10">
                                            <div className="flex items-center h-full">
                                                <Select
                                                    value={selectedLanguage}
                                                    onValueChange={setSelectedLanguage}
                                                >
                                                    <SelectTrigger className="p-0 h-auto text-sm font-medium text-muted-foreground border-0 hover:no-underline focus:ring-0 focus:ring-offset-0">
                                                        {capFirst(selectedLanguage)}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Languages</SelectItem>
                                                        {languages.map((lang) => (
                                                            <SelectItem key={lang.toLowerCase()} value={lang.toLowerCase()}>
                                                                {capFirst(lang)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[15%] h-10">Status</TableHead>
                                        <TableHead className="w-[25%] h-10">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <Table>
                                <TableBody>
                                    {filteredSessions.map((session) => (
                                        <TableRow
                                            key={session.id}
                                            className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                            onClick={() => navigate(`/sessions/${session.id}`)}
                                        >
                                            <TableCell className="max-w-md truncate py-3">
                                                {session.summary}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                {session.language != null && capFirst(session.language)}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                {session.created_at && formatDate(session.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredSessions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                {selectedLanguage === 'all'
                                                    ? "No sessions found. Create a new session to get started."
                                                    : `No ${selectedLanguage} sessions found.`}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Sessions;