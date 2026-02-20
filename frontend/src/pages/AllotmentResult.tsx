import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';

type AllottedCourse = {
  course_id: string;
  course_name: string;
  credits: number;
  status: 'allotted' | 'waitlisted';
  rank: number;
  enrollment_date: string;
};

type ResultData = {
  allotted: AllottedCourse[];
  waitlisted: AllottedCourse[];
  published: boolean;
};

export function AllotmentResult() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    api<ResultData>('/allotment/result', { token: accessToken })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Allotment Results</h1>
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Allotment Results</h1>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Allotment Results</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Results not available yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Allotment results will be published here once the process is complete.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCredits = [...(data.allotted || []), ...(data.waitlisted || [])].reduce(
    (sum, c) => sum + c.credits,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Allotment Results
        </h1>
        <p className="text-muted-foreground mt-1">View your course allotment status</p>
      </div>

      {!data.published && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                Results are not yet published. Check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Allotted Courses</p>
                <p className="text-3xl font-bold text-emerald-700">{data.allotted?.length || 0}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waitlisted Courses</p>
                <p className="text-3xl font-bold text-orange-700">{data.waitlisted?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-3xl font-bold text-blue-700">{totalCredits}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allotted Courses */}
      {data.allotted && data.allotted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Allotted Courses ({data.allotted.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {data.allotted.map((course) => (
                <div
                  key={course.course_id}
                  className="p-4 rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">{course.course_id}</span>
                        <span className="font-medium">{course.course_name}</span>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{course.credits} credits</span>
                        <span>Rank: {course.rank}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      Allotted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waitlisted Courses */}
      {data.waitlisted && data.waitlisted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Waitlisted Courses ({data.waitlisted.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {data.waitlisted.map((course) => (
                <div
                  key={course.course_id}
                  className="p-4 rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-700">{course.course_id}</span>
                        <span className="font-medium">{course.course_name}</span>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{course.credits} credits</span>
                        <span>Rank: {course.rank}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Waitlisted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!data.allotted || data.allotted.length === 0) &&
        (!data.waitlisted || data.waitlisted.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No courses allotted</p>
              <p className="text-sm text-muted-foreground mt-2">
                You have not been allotted any courses in this round.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
