import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WeatherWidget = () => {
  // Mock weather data - can be replaced with real API
  const weatherData = {
    location: "New Delhi, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Today", high: 30, low: 22, icon: Sun },
      { day: "Tue", high: 28, low: 21, icon: Cloud },
      { day: "Wed", high: 25, low: 19, icon: CloudRain },
      { day: "Thu", high: 27, low: 20, icon: Sun },
      { day: "Fri", high: 29, low: 21, icon: Cloud },
    ],
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            Weather Insights
          </h2>
          <p className="text-muted-foreground">
            Plan your farming activities with accurate weather forecasts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <Card className="lg:col-span-2 card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Sun className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{weatherData.location}</p>
                    <h3 className="text-4xl font-bold text-foreground">
                      {weatherData.temperature}°C
                    </h3>
                    <p className="text-lg text-muted-foreground">{weatherData.condition}</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="font-semibold">{weatherData.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="font-semibold">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => {
                    const Icon = day.icon;
                    return (
                      <div
                        key={index}
                        className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{day.day}</p>
                        <Icon className="w-8 h-8 mx-auto my-2 text-primary" />
                        <p className="text-sm">
                          <span className="font-semibold">{day.high}°</span>
                          <span className="text-muted-foreground"> / {day.low}°</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farming Tips Card */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Today's Farming Tips</h3>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    🌱 <strong>Ideal for planting:</strong> Moderate temperatures make it perfect for transplanting seedlings.
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💧 <strong>Irrigation:</strong> Water early morning to reduce evaporation. Humidity is moderate.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    🌾 <strong>Harvesting:</strong> Good conditions for harvesting wheat and barley crops.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    🐛 <strong>Pest Alert:</strong> Monitor for aphids due to warm weather conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeatherWidget;
