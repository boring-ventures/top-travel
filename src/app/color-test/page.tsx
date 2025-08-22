import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ColorTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Corporate Color System
          </h1>
          <p className="text-muted-foreground text-lg">
            Showcase of the new corporate color palette based on blue
            (30,73,110) and red (187,80,60)
          </p>
        </div>

        {/* Primary Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Corporate Colors</CardTitle>
            <CardDescription>Main brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Corporate Blue</h3>
                <div className="h-20 bg-corporate-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Primary Blue</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  RGB: 30, 73, 110 | HSL: 210, 57%, 27%
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Corporate Red</h3>
                <div className="h-20 bg-corporate-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Primary Red</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  RGB: 187, 80, 60 | HSL: 10, 51%, 48%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blue Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Blue Color Variations</CardTitle>
            <CardDescription>
              Different shades of the corporate blue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-blue-lighter rounded-lg border"></div>
                <p className="text-xs text-center">blue-lighter</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-blue-light rounded-lg border"></div>
                <p className="text-xs text-center">blue-light</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-corporate-blue rounded-lg border"></div>
                <p className="text-xs text-center text-white">corporate-blue</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-blue-dark rounded-lg border"></div>
                <p className="text-xs text-center text-white">blue-dark</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-blue-darker rounded-lg border"></div>
                <p className="text-xs text-center text-white">blue-darker</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Red Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Red Color Variations</CardTitle>
            <CardDescription>
              Different shades of the corporate red
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-red-lighter rounded-lg border"></div>
                <p className="text-xs text-center">red-lighter</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-red-light rounded-lg border"></div>
                <p className="text-xs text-center">red-light</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-corporate-red rounded-lg border"></div>
                <p className="text-xs text-center text-white">corporate-red</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-red-dark rounded-lg border"></div>
                <p className="text-xs text-center text-white">red-dark</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-red-darker rounded-lg border"></div>
                <p className="text-xs text-center text-white">red-darker</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Button Examples</CardTitle>
            <CardDescription>
              Different button styles using the corporate colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className="bg-corporate-blue hover:bg-blue-dark">
                Primary Blue Button
              </Button>
              <Button className="bg-corporate-red hover:bg-red-dark">
                Primary Red Button
              </Button>
              <Button
                variant="secondary"
                className="bg-blue-lighter text-corporate-blue hover:bg-blue-light"
              >
                Secondary Blue
              </Button>
              <Button
                variant="secondary"
                className="bg-red-lighter text-corporate-red hover:bg-red-light"
              >
                Secondary Red
              </Button>
              <Button
                variant="outline"
                className="border-corporate-blue text-corporate-blue hover:bg-blue-lighter"
              >
                Outline Blue
              </Button>
              <Button
                variant="outline"
                className="border-corporate-red text-corporate-red hover:bg-red-lighter"
              >
                Outline Red
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Examples</CardTitle>
            <CardDescription>
              Badge styles using the corporate colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-corporate-blue text-white">Blue Badge</Badge>
              <Badge className="bg-corporate-red text-white">Red Badge</Badge>
              <Badge
                variant="outline"
                className="border-corporate-blue text-corporate-blue"
              >
                Blue Outline
              </Badge>
              <Badge
                variant="outline"
                className="border-corporate-red text-corporate-red"
              >
                Red Outline
              </Badge>
              <Badge className="bg-blue-lighter text-corporate-blue">
                Light Blue
              </Badge>
              <Badge className="bg-red-lighter text-corporate-red">
                Light Red
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Text Color Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Text Color Examples</CardTitle>
            <CardDescription>
              Text colors using the corporate palette
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-corporate-blue text-xl font-semibold">
                Corporate Blue Text
              </h3>
              <h3 className="text-corporate-red text-xl font-semibold">
                Corporate Red Text
              </h3>
              <p className="text-blue-dark">Dark Blue Text</p>
              <p className="text-red-dark">Dark Red Text</p>
              <p className="text-blue-light">Light Blue Text</p>
              <p className="text-red-light">Light Red Text</p>
            </div>
          </CardContent>
        </Card>

        {/* Semantic Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Semantic Colors</CardTitle>
            <CardDescription>
              System colors that automatically use corporate colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Primary (uses corporate blue)</Button>
              <Button variant="destructive">
                Destructive (uses corporate red)
              </Button>
              <Button variant="secondary">Secondary (uses light blue)</Button>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Badge>Default Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dark Mode Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Dark Mode Support</CardTitle>
            <CardDescription>
              Colors automatically adapt to dark mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Toggle your browser's dark mode to see how the colors adapt. The
              corporate colors maintain their identity while ensuring proper
              contrast and readability in both light and dark themes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
