import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Trophy,
  BookOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_order: number;
  duration_minutes: number;
  quiz_data: {
    questions: Array<{
      question: string;
      options: string[];
      correct: number;
    }>;
  };
}

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      if (courseId) {
        await fetchCourseData(user.id, courseId);
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate, courseId]);

  const fetchCourseData = async (userId: string, courseId: string) => {
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("lesson_order", { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons((lessonsData as unknown as Lesson[]) || []);

      // Fetch enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("user_course_enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (enrollmentError) {
        navigate("/courses");
        return;
      }
      setEnrollment(enrollmentData);

      // Fetch completed lessons
      const { data: completionsData, error: completionsError } = await supabase
        .from("user_lesson_completions")
        .select("lesson_id")
        .eq("user_id", userId);

      if (completionsError) throw completionsError;
      setCompletedLessons(completionsData?.map((c: any) => c.lesson_id) || []);

      // Set current lesson
      if (lessonsData && lessonsData.length > 0) {
        const currentLessonOrder = enrollmentData?.current_lesson_order || 1;
        const lesson = lessonsData.find((l) => l.lesson_order === currentLessonOrder);
        setCurrentLesson((lesson || lessonsData[0]) as unknown as Lesson);
      }
    } catch (error: any) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course",
        variant: "destructive",
      });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!currentLesson || quizAnswer === null || !user) return;

    const isCorrect = quizAnswer === currentLesson.quiz_data.questions[0].correct;

    if (isCorrect) {
      try {
        // Mark lesson as complete
        await supabase.from("user_lesson_completions").insert({
          user_id: user.id,
          lesson_id: currentLesson.id,
          quiz_score: 100,
          time_spent_minutes: currentLesson.duration_minutes,
        });

        // Update enrollment progress
        const nextLessonOrder = currentLesson.lesson_order + 1;
        const isLastLesson = currentLesson.lesson_order === lessons.length;

        await supabase
          .from("user_course_enrollments")
          .update({
            current_lesson_order: isLastLesson ? currentLesson.lesson_order : nextLessonOrder,
            completed_at: isLastLesson ? new Date().toISOString() : null,
          })
          .eq("id", enrollment.id);

        setCompletedLessons([...completedLessons, currentLesson.id]);
        setQuizSubmitted(true);

        if (isLastLesson) {
          toast({
            title: "🎉 Course Completed!",
            description: "You've earned 200 points and a Course Completer badge!",
          });
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast({
            title: "Correct! ✓",
            description: "Moving to next lesson...",
          });
          setTimeout(() => {
            const nextLesson = lessons.find((l) => l.lesson_order === nextLessonOrder);
            if (nextLesson) {
              setCurrentLesson(nextLesson);
              setShowQuiz(false);
              setQuizSubmitted(false);
              setQuizAnswer(null);
            }
          }, 1500);
        }
      } catch (error: any) {
        console.error("Error completing lesson:", error);
        toast({
          title: "Error",
          description: "Failed to save progress",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No lessons available</p>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </Card>
      </div>
    );
  }

  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/courses")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">{course?.title}</span>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {completedLessons.length}/{lessons.length} Lessons
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lessons
              </h3>
              <div className="space-y-2">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isCurrent = currentLesson.id === lesson.id;
                  const isLocked = lesson.lesson_order > (enrollment?.current_lesson_order || 1);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (!isLocked) {
                          setCurrentLesson(lesson);
                          setShowQuiz(false);
                          setQuizSubmitted(false);
                          setQuizAnswer(null);
                        }
                      }}
                      disabled={isLocked}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent
                          ? "bg-primary/10 border border-primary/20"
                          : isCompleted
                          ? "bg-success/10 border border-success/20"
                          : isLocked
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isCompleted && <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />}
                          <span className="text-sm truncate">{lesson.lesson_order}. {lesson.title}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!showQuiz ? (
              <Card className="p-8">
                <div className="mb-6">
                  <Badge className="mb-4">
                    Lesson {currentLesson.lesson_order}/{lessons.length}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>
                  <div className="text-muted-foreground mb-6">
                    Duration: {currentLesson.duration_minutes} minutes
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {currentLesson.content}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow"
                    onClick={() => setShowQuiz(true)}
                  >
                    Take Quiz
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8">
                <div className="mb-6">
                  <Badge className="mb-4 bg-accent/10 text-accent">Quiz Time!</Badge>
                  <h2 className="text-2xl font-bold mb-4">{currentLesson.title} - Quiz</h2>
                </div>

                {currentLesson.quiz_data?.questions?.map((question, qIdx) => (
                  <div key={qIdx} className="mb-6">
                    <p className="font-bold text-lg mb-4">{question.question}</p>
                    <RadioGroup
                      value={quizAnswer?.toString()}
                      onValueChange={(value) => setQuizAnswer(parseInt(value))}
                      disabled={quizSubmitted}
                    >
                      {question.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center space-x-2 p-4 rounded-lg border transition-all ${
                            quizSubmitted && optIdx === question.correct
                              ? "bg-success/10 border-success"
                              : quizSubmitted && optIdx === quizAnswer
                              ? "bg-destructive/10 border-destructive"
                              : "hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem value={optIdx.toString()} id={`option-${optIdx}`} />
                          <Label htmlFor={`option-${optIdx}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                          {quizSubmitted && optIdx === question.correct && (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowQuiz(false)}>
                    Back to Lesson
                  </Button>
                  <Button
                    className="bg-gradient-primary hover:shadow-glow"
                    disabled={quizAnswer === null || quizSubmitted}
                    onClick={handleSubmitQuiz}
                  >
                    {quizSubmitted ? (
                      <>
                        <Trophy className="mr-2 h-5 w-5" />
                        Completed!
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
