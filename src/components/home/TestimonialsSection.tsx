import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    role: "Wheat Farmer",
    content: "Krushi Mitra helped me identify a fungal infection early and saved my entire wheat crop. The AI detection is incredibly accurate!",
    rating: 5,
    avatar: "RK",
  },
  {
    name: "Sunita Devi",
    location: "Maharashtra, India",
    role: "Vegetable Farmer",
    content: "The yield prediction feature helped me plan better. I increased my income by 30% this season using the soil analysis recommendations.",
    rating: 5,
    avatar: "SD",
  },
  {
    name: "Mohan Singh",
    location: "Haryana, India",
    role: "Rice Farmer",
    content: "Simple to use even for someone like me who isn't tech-savvy. The weather alerts saved my crops from unexpected rainfall damage.",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "Lakshmi Prasad",
    location: "Andhra Pradesh, India",
    role: "Cotton Farmer",
    content: "The marketplace feature is amazing! I sold my cotton directly to buyers at better prices. No middlemen, more profit!",
    rating: 5,
    avatar: "LP",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Trusted by Thousands of Farmers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from farmers who have transformed their agricultural practices with Krushi Mitra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 relative overflow-hidden"
            >
              <CardContent className="p-6">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">10K+</span>
              <span className="text-sm">Active Farmers</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">50K+</span>
              <span className="text-sm">Crops Analyzed</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">95%</span>
              <span className="text-sm">Detection Accuracy</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">₹5Cr+</span>
              <span className="text-sm">Farmer Earnings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
