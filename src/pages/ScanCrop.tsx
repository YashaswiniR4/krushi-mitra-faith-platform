import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  Leaf,
  Info,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ScanCrop = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    recommendation: string;
    severity: "low" | "medium" | "high";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // Simulate AI analysis - will be replaced with actual API call
    setTimeout(() => {
      setResult({
        disease: "Bacterial Leaf Blight",
        confidence: 92,
        recommendation: "Apply copper-based fungicide. Remove and destroy infected leaves. Ensure proper drainage and avoid overhead irrigation. Consider resistant varieties for next season.",
        severity: "medium",
      });
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Disease detected with 92% confidence",
      });
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "high": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Crop Disease Scanner</h1>
            <p className="text-sm text-muted-foreground">Upload an image for AI analysis</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:gap-8">
          {/* Upload Section */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Upload Crop Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Click to upload crop image
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="w-full max-h-96 object-contain bg-black/5"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Leaf className="w-4 h-4" />
                          Analyze Crop
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="card-elevated animate-slide-up">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Disease Info */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif font-bold text-lg text-foreground">
                        {result.disease}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                        {result.severity.toUpperCase()} Severity
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Detected with <strong className="text-foreground">{result.confidence}%</strong> confidence
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Recommendations</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    Save to History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Tips for Best Results</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take clear, well-lit photos of affected leaves or plants</li>
                    <li>• Include close-up shots of discolored or damaged areas</li>
                    <li>• Avoid blurry or dark images for accurate detection</li>
                    <li>• Capture multiple angles if possible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ScanCrop;
