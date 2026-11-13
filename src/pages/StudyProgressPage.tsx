import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { STUDY_TOPICS } from "../data/studyTopics";
import { getRecentStudyDays, getStudyDateOffset, getStudyStreak, getUtcDateKey } from "../lib/studyProgress";
import { supabase } from "../lib/supabase";

interface TopicProgress {
  topic_id: string;
  completed: boolean;
  completed_at: string | null;
}

interface StudyActivity {
  activity_date: string;
}

export default function StudyProgressPage() {
  const { user, loading: authLoading, configured } = useAuth();
  const [topicProgress, setTopicProgress] = useState<Record<string, boolean>>({});
  const [completedAt, setCompletedAt] = useState<Record<string, string | null>>({});
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTopic, setSavingTopic] = useState<string | null>(null);
  const [loggingSession, setLoggingSession] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      supabase
        .from("study_topic_progress")
        .select("topic_id, completed, completed_at")
        .eq("user_id", user.id),
      supabase
        .from("study_activity")
        .select("activity_date")
        .eq("user_id", user.id)
        .order("activity_date", { ascending: false }),
    ])
      .then(([progressResult, activityResult]) => {
        if (!active) return;
        if (progressResult.error) throw progressResult.error;
        if (activityResult.error) throw activityResult.error;

        const progressRows = progressResult.data as TopicProgress[];
        const activityRows = activityResult.data as StudyActivity[];
        setTopicProgress(Object.fromEntries(progressRows.map((row) => [row.topic_id, row.completed])));
        setCompletedAt(Object.fromEntries(progressRows.map((row) => [row.topic_id, row.completed_at])));
        setActivityDates(activityRows.map((row) => row.activity_date));
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load your study progress.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  const completedCount = useMemo(
    () => STUDY_TOPICS.filter((topic) => topicProgress[topic.id]).length,
    [topicProgress],
  );
  const completionPercent = Math.round((completedCount / STUDY_TOPICS.length) * 100);
  const studyStreak = getStudyStreak(activityDates);
  const recentStudyDays = getRecentStudyDays(activityDates);
  const today = getUtcDateKey();
  const studiedToday = activityDates.includes(today);
  const nextTopic = STUDY_TOPICS.find((topic) => !topicProgress[topic.id]);

  const toggleTopic = async (topicId: string) => {
    if (!supabase) return;
    const completed = !topicProgress[topicId];
    setSavingTopic(topicId);
    setError("");
    setMessage("");

    try {
      const { error: saveError } = await supabase.rpc("save_study_topic", {
        p_topic_id: topicId,
        p_completed: completed,
      });
      if (saveError) throw saveError;

      setTopicProgress((current) => ({ ...current, [topicId]: completed }));
      setCompletedAt((current) => ({ ...current, [topicId]: completed ? new Date().toISOString() : null }));
      if (completed) setActivityDates((current) => current.includes(today) ? current : [today, ...current]);
      setMessage(completed ? "Topic marked complete. Nice work!" : "Topic moved back to your study list.");
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this topic.");
    } finally {
      setSavingTopic(null);
    }
  };

  const logStudySession = async () => {
    if (!supabase) return;
    setLoggingSession(true);
    setError("");
    setMessage("");
    try {
      const { error: sessionError } = await supabase.rpc("record_study_session");
      if (sessionError) throw sessionError;
      setActivityDates((current) => current.includes(today) ? current : [today, ...current]);
      setMessage("Today's study session is recorded.");
    } catch (sessionError: unknown) {
      setError(sessionError instanceof Error ? sessionError.message : "Could not record today's study session.");
    } finally {
      setLoggingSession(false);
    }
  };

  if (authLoading || loading) {
    return (
      <section className="mx-auto max-w-4xl" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Your learning dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Study Progress</h1>
        <p className="mt-4 text-slate-600">Loading your study progress…</p>
      </section>
    );
  }

  if (!configured) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Your learning dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Study Progress</h1>
        <p className="mt-4 leading-6 text-slate-600">Connect Supabase to save topic progress securely to your account.</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Your learning dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Study Progress</h1>
        <p className="mt-4 leading-6 text-slate-600">
          Sign in to check off chemistry topics and keep your progress and study streak synced to your account.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700">Sign in</Link>
          <Link to="/signup" className="rounded-xl border border-indigo-200 px-4 py-2.5 font-semibold text-indigo-700 hover:bg-indigo-50">Create account</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <header className="mb-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">Your learning dashboard</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Study Progress</h1>
        <p className="mt-3 text-slate-600">Build a steady study habit, one chemistry topic at a time. Your progress is private to your account.</p>
      </header>

      {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Topics complete</p>
          <p className="mt-2 text-3xl font-extrabold text-indigo-700">{completedCount}<span className="text-lg font-semibold text-slate-500"> / {STUDY_TOPICS.length}</span></p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Study streak</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">{studyStreak}<span className="ml-1 text-lg font-semibold text-slate-500">{studyStreak === 1 ? "day" : "days"}</span></p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Study days this week</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700">{recentStudyDays}<span className="text-lg font-semibold text-slate-500"> / 7</span></p>
        </article>
      </div>

      <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6" aria-label="Overall topic completion">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900">Overall progress</h2>
          <span className="text-sm font-bold text-indigo-700">{completionPercent}%</span>
        </div>
        <div
          className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Chemistry topics completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercent}
        >
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${completionPercent}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Study activity is recorded using UTC dates.</p>
          <button
            type="button"
            onClick={logStudySession}
            disabled={studiedToday || loggingSession}
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {studiedToday ? "Today's session recorded" : loggingSession ? "Recording…" : "Log a study session"}
          </button>
        </div>
      </section>

      {nextTopic && (
        <section className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 p-5 text-white shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-100">Suggested next topic</p>
            <h2 className="mt-1 text-lg font-bold">{nextTopic.title}</h2>
            <p className="mt-1 text-sm text-indigo-100">{nextTopic.description}</p>
          </div>
          <Link to={nextTopic.toolPath} className="mt-4 inline-flex shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 sm:mt-0">
            {nextTopic.toolLabel} <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      <div className="mt-7 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chemistry topic checklist</h2>
          <p className="mt-1 text-sm text-slate-600">Mark a topic complete when you feel ready to move on. You can change it anytime.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {STUDY_TOPICS.map((topic) => {
          const completed = Boolean(topicProgress[topic.id]);
          const isSaving = savingTopic === topic.id;
          const completedDate = completedAt[topic.id]?.slice(0, 10);
          const completedDaysAgo = completedDate ? getStudyDateOffset(completedDate) : null;
          const completedLabel = completedDaysAgo === 0
            ? "today"
            : completedDaysAgo === 1
              ? "yesterday"
              : completedDaysAgo !== null && completedDaysAgo > 1
                ? `${completedDaysAgo} days ago`
                : "previously";
          return (
            <article key={topic.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <input
                  id={`topic-${topic.id}`}
                  type="checkbox"
                  checked={completed}
                  disabled={savingTopic !== null}
                  onChange={() => toggleTopic(topic.id)}
                  className="mt-1 h-5 w-5 shrink-0 accent-indigo-600"
                  aria-label={`Mark ${topic.title} ${completed ? "incomplete" : "complete"}`}
                />
                <div className="min-w-0 flex-1">
                  <label htmlFor={`topic-${topic.id}`} className="cursor-pointer font-bold text-slate-900">
                    {topic.title}
                  </label>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{topic.description}</p>
                </div>
                {isSaving && <span className="text-xs text-slate-500" aria-live="polite">Saving…</span>}
              </div>
              <Link to={topic.toolPath} className="mt-3 self-start text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                {topic.toolLabel} <span aria-hidden="true">→</span>
              </Link>
              {completed && (
                <p className="mt-2 text-xs font-medium text-emerald-700">Completed · {completedLabel}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
