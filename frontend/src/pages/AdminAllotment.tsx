import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Zap, Trash2, Eye } from 'lucide-react';

interface AllotmentResult {
  students_processed: number;
  total_allotted: number;
  total_waitlisted: number;
  timestamp: string;
}

export function AdminAllotment() {
  const { accessToken } = useAuth();
  const [result, setResult] = useState<AllotmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [published, setPublished] = useState(false);

  const runAllotment = async () => {
    if (!accessToken) return;

    const confirmed = window.confirm(
      'This will clear all existing allotments and run the allotment algorithm. Continue?'
    );
    if (!confirmed) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await api<{ result: AllotmentResult }>('/admin/allotment/run', {
        method: 'POST',
        token: accessToken,
      });
      setResult(data.result);
      setSuccess('Allotment completed successfully!');
      setPublished(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run allotment');
    } finally {
      setLoading(false);
    }
  };

  const publishResults = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api('/admin/allotment/publish', {
        method: 'POST',
        token: accessToken,
      });
      setPublished(true);
      setSuccess('Results published successfully!');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to publish results');
    } finally {
      setLoading(false);
    }
  };

  const unpublishResults = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api('/admin/allotment/unpublish', {
        method: 'POST',
        token: accessToken,
      });
      setPublished(false);
      setSuccess('Results unpublished successfully!');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to unpublish results');
    } finally {
      setLoading(false);
    }
  };

  const checkPublishedStatus = async () => {
    if (!accessToken) return;
    try {
      const data = await api<{ published: boolean }>('/admin/allotment/status', {
        token: accessToken,
      });
      setPublished(data.published);
    } catch {
      // Ignore errors
    }
  };

  useEffect(() => {
    checkPublishedStatus();
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Allotment Management
        </h1>
        <p className="text-muted-foreground mt-1">Run and manage course allotment process</p>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Run Allotment */}
      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            Run Allotment Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will process all student preferences and allocate courses based on the allotment algorithm.
            Existing allotments will be cleared.
          </p>
          <Button
            onClick={runAllotment}
            disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            {loading ? 'Running...' : 'Run Allotment'}
          </Button>
        </CardContent>
      </Card>

      {/* Allotment Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Allotment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <p className="text-sm text-muted-foreground">Students Processed</p>
                <p className="text-2xl font-bold text-blue-700">{result.students_processed}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                <p className="text-sm text-muted-foreground">Total Allotted</p>
                <p className="text-2xl font-bold text-emerald-700">{result.total_allotted}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
                <p className="text-sm text-muted-foreground">Total Waitlisted</p>
                <p className="text-2xl font-bold text-orange-700">{result.total_waitlisted}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <p className="text-sm text-muted-foreground">Completed At</p>
                <p className="text-xs font-medium text-purple-700 mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish/Unpublish */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Publish Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {published
                ? 'Results are currently published and visible to students.'
                : 'Results are not published. Students cannot see them yet.'}
            </p>
            <div className="flex gap-3">
              {published ? (
                <Button
                  onClick={unpublishResults}
                  disabled={loading}
                  variant="outline"
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Unpublish Results
                </Button>
              ) : (
                <Button
                  onClick={publishResults}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Publish Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
