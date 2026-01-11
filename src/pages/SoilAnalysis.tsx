import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Droplets, 
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  ThermometerSun,
  Leaf,
  FileText,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SoilAnalysis = () => {
  const [formData, setFormData] = useState({
    ph: 6.5,
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: 50,
    temperature: "",
    soilType: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    fertilityScore: number;
    status: "poor" | "moderate" | "good" | "excellent";
    recommendations: string[];
    nutrients: { name: string; level: "low" | "optimal" | "high"; value: string }[];
  } | null>(null);
  const { toast } = useToast();

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Simulate analysis - will be replaced with actual API call
    setTimeout(() => {
      setResult({
        fertilityScore: 72,
        status: "good",
        recommendations: [
          "Add nitrogen-rich fertilizers to improve crop growth",
          "Maintain current pH levels for optimal nutrient absorption",
          "Consider adding organic matter to improve soil structure",
          "Implement drip irrigation to optimize moisture levels",
        ],
        nutrients: [
          { name: "Nitrogen (N)", level: "low", value: formData.nitrogen || "45 kg/ha" },
          { name: "Phosphorus (P)", level: "optimal", value: formData.phosphorus || "28 kg/ha" },
          { name: "Potassium (K)", level: "optimal", value: formData.potassium || "156 kg/ha" },
          { name: "pH Level", level: "optimal", value: String(formData.ph) },
          { name: "Moisture", level: formData.moisture < 40 ? "low" : formData.moisture > 70 ? "high" : "optimal", value: `${formData.moisture}%` },
        ],
      });
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Soil fertility score: 72/100",
      });
    }, 2500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "moderate": return "text-amber-600 bg-amber-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "optimal": return "text-green-600";
      case "low": return "text-amber-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
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
            <h1 className="text-xl font-serif font-bold text-foreground">Soil Analysis</h1>
            <p className="text-sm text-muted-foreground">Enter soil test data for fertility assessment</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:gap-8">
          {/* Input Form */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Soil Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={formData.soilType} onValueChange={(value) => handleChange("soilType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="peaty">Peaty</SelectItem>
                        <SelectItem value="chalky">Chalky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Soil Temperature (°C)</Label>
                    <div className="relative">
                      <ThermometerSun className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="e.g., 25"
                        value={formData.temperature}
                        onChange={(e) => handleChange("temperature", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* pH Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>pH Level</Label>
                    <span className="text-sm font-medium text-foreground">{formData.ph}</span>
                  </div>
                  <Slider
                    value={[formData.ph]}
                    onValueChange={(value) => handleChange("ph", value[0])}
                    min={0}
                    max={14}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Acidic (0)</span>
                    <span>Neutral (7)</span>
                    <span>Alkaline (14)</span>
                  </div>
                </div>

                {/* Moisture Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Moisture Level</Label>
                    <span className="text-sm font-medium text-foreground">{formData.moisture}%</span>
                  </div>
                  <Slider
                    value={[formData.moisture]}
                    onValueChange={(value) => handleChange("moisture", value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* NPK Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.nitrogen}
                      onChange={(e) => handleChange("nitrogen", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
                    <Input
                      id="phosphorus"
                      type="number"
                      placeholder="e.g., 28"
                      value={formData.phosphorus}
                      onChange={(e) => handleChange("phosphorus", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (kg/ha)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      placeholder="e.g., 156"
                      value={formData.potassium}
                      onChange={(e) => handleChange("potassium", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Soil...
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4" />
                      Analyze Soil
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="card-elevated animate-slide-up">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fertility Score */}
                <div className="text-center p-6 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Soil Fertility Score</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${result.fertilityScore * 3.52} 352`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-serif font-bold">{result.fertilityScore}</span>
                    </div>
                  </div>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>

                {/* Nutrient Levels */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Nutrient Levels</h4>
                  {result.nutrients.map((nutrient) => (
                    <div key={nutrient.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-foreground">{nutrient.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{nutrient.value}</span>
                        <span className={`text-sm font-medium ${getLevelColor(nutrient.level)}`}>
                          {nutrient.level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
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
        </div>
      </main>
    </div>
  );
};

export default SoilAnalysis;
