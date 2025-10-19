import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  ArrowLeft,
  Clock,
  BookOpen,
  Lock,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  is_free: boolean;
  price_points: number;
  total_lessons: number;
  duration_hours: number;
}

interface Enrollment {
  course_id: string;
  current_lesson_order: number;
  completed_at: string | null;
}

const Courses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profile, setProfile] = useState<any>(null);

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
      await fetchData(user.id);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("points_balance")
        .eq("id", userId)
        .maybeSingle();

      setProfile(profileData);

      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("is_free", { ascending: false })
        .order("created_at", { ascending: true });

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch user enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("user_course_enrollments")
        .select("course_id, current_lesson_order, completed_at")
        .eq("user_id", userId);

      if (enrollmentsError) throw enrollmentsError;
      setEnrollments(enrollmentsData || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    }
  };

  const handleEnroll = async (courseId: string, isFree: boolean, pricePoints: number) => {
    if (!user) return;

    // Check if already enrolled
    const isEnrolled = enrollments.some((e) => e.course_id === courseId);
    if (isEnrolled) {
      navigate(`/course/${courseId}`);
      return;
    }

    // Check if can afford paid course
    if (!isFree && (profile?.points_balance || 0) < pricePoints) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pricePoints} points to enroll in this course.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Enroll user
      const { error: enrollError } = await supabase.from("user_course_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      });

      if (enrollError) throw enrollError;

      // If paid course, deduct points
      if (!isFree) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            points_balance: (profile?.points_balance || 0) - pricePoints,
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Create transaction
        await supabase.from("transactions").insert({
          user_id: user.id,
          title: `Enrolled in paid course`,
          points_change: -pricePoints,
          transaction_type: "redeem",
          status: "completed",
        });
      }

      toast({
        title: "Enrolled Successfully! 🎓",
        description: "You can now start learning.",
      });

      // Refresh and navigate
      await fetchData(user.id);
      navigate(`/course/${courseId}`);
    } catch (error: any) {
      console.error("Error enrolling:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const getCourseProgress = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.course_id === courseId);
    return enrollment;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const freeCourses = courses.filter((c) => c.is_free);
  const paidCourses = courses.filter((c) => !c.is_free);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MCE
              </span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary">
            {profile?.points_balance || 0} Points
          </Badge>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            Course Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Start learning with free courses, then unlock advanced content
          </p>
        </div>

        {/* Free Courses */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <PlayCircle className="h-8 w-8 text-success" />
            Free Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.map((course) => {
              const progress = getCourseProgress(course.id);
              const isEnrolled = !!progress;
              const isCompleted = !!progress?.completed_at;

              return (
                <Card
                  key={course.id}
                  className="p-6 hover:shadow-glow transition-all group relative overflow-hidden"
                >
                  {isCompleted && (
                    <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}

                  <div className="mb-4">
                    <Badge className="mb-2">{course.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration_hours}h
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.total_lessons} lessons
                    </div>
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                  </div>

                  {isEnrolled && !isCompleted && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          Lesson {progress.current_lesson_order}/{course.total_lessons}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all"
                          style={{
                            width: `${((progress.current_lesson_order || 1) / course.total_lessons) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow"
                    onClick={() => handleEnroll(course.id, true, 0)}
                  >
                    {isCompleted ? "Review Course" : isEnrolled ? "Continue Learning" : "Start Free"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Paid Courses */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-accent" />
            Premium Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paidCourses.map((course) => {
              const progress = getCourseProgress(course.id);
              const isEnrolled = !!progress;
              const isCompleted = !!progress?.completed_at;
              const canAfford = (profile?.points_balance || 0) >= course.price_points;

              return (
                <Card
                  key={course.id}
                  className="p-6 hover:shadow-glow transition-all group relative overflow-hidden border-accent/20"
                >
                  {isCompleted && (
                    <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-accent/10 text-accent">{course.category}</Badge>
                      {!isEnrolled && (
                        <Badge className="bg-warning/10 text-warning">
                          {course.price_points} pts
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration_hours}h
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.total_lessons} lessons
                    </div>
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                  </div>

                  {isEnrolled && !isCompleted && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          Lesson {progress.current_lesson_order}/{course.total_lessons}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all"
                          style={{
                            width: `${((progress.current_lesson_order || 1) / course.total_lessons) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow"
                    disabled={!isEnrolled && !canAfford}
                    onClick={() => handleEnroll(course.id, false, course.price_points)}
                  >
                    {isEnrolled ? (
                      isCompleted ? (
                        "Review Course"
                      ) : (
                        "Continue Learning"
                      )
                    ) : canAfford ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Enroll ({course.price_points} pts)
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Need {course.price_points - (profile?.points_balance || 0)} more pts
                      </>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
