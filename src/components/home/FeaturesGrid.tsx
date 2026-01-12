import { 
  Smartphone, 
  Shield, 
  Zap, 
  Globe, 
  MessageSquare, 
  Bell,
  Wallet,
  BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access from any device - phone, tablet, or desktop",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your farm data is encrypted and secure with us",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Zap,
    title: "Real-time Analysis",
    description: "Instant AI-powered crop and soil analysis results",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for Hindi, English, and regional languages",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: MessageSquare,
    title: "Expert Support",
    description: "Connect with agricultural experts for guidance",
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Weather warnings and pest outbreak notifications",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: Wallet,
    title: "Marketplace",
    description: "Buy seeds, fertilizers and sell your produce",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description: "Tutorials and best practices for modern farming",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Everything You Need for Smart Farming
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to make farming easier, more profitable, and sustainable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
