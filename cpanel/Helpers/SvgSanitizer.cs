using Ganss.Xss;

namespace micpanel.Helpers
{
    /// <summary>
    /// Sanitizes SVG content to prevent XSS (removes script, event handlers, and dangerous elements).
    /// Uses an allow-list of safe SVG elements and attributes only.
    /// </summary>
    public static class SvgSanitizer
    {
        private static readonly HashSet<string> SafeSvgTags = new(StringComparer.OrdinalIgnoreCase)
        {
            "svg", "path", "circle", "rect", "g", "defs", "use", "line", "ellipse", "polygon", "polyline",
            "symbol", "clipPath", "pattern", "linearGradient", "radialGradient", "stop", "image", "text",
            "tspan", "title", "desc", "marker", "mask", "metadata"
        };

        private static readonly HashSet<string> SafeSvgAttributes = new(StringComparer.OrdinalIgnoreCase)
        {
            "d", "cx", "cy", "r", "rx", "ry", "viewBox", "fill", "stroke", "transform", "x", "y",
            "width", "height", "x1", "y1", "x2", "y2", "points", "href", "xlink:href", "id", "class",
            "opacity", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-dasharray",
            "fill-rule", "clip-path", "clip-rule", "mask", "display", "visibility", "font-size",
            "font-family", "text-anchor", "dx", "dy", "rotate", "gradientUnits", "gradientTransform",
            "offset", "stop-color", "stop-opacity", "patternUnits", "patternTransform", "preserveAspectRatio",
            "xmlns", "xmlns:xlink"
        };

        private static readonly Lazy<HtmlSanitizer> Sanitizer = new(CreateSvgSanitizer);

        private static HtmlSanitizer CreateSvgSanitizer()
        {
            var sanitizer = new HtmlSanitizer();
            sanitizer.AllowedTags.Clear();
            foreach (var tag in SafeSvgTags)
                sanitizer.AllowedTags.Add(tag);
            sanitizer.AllowedAttributes.Clear();
            foreach (var attr in SafeSvgAttributes)
                sanitizer.AllowedAttributes.Add(attr);
            // No scripts: only https, http, and data for embedded images
            sanitizer.AllowedSchemes.Clear();
            sanitizer.AllowedSchemes.Add("https");
            sanitizer.AllowedSchemes.Add("http");
            sanitizer.AllowedSchemes.Add("data");
            // Ensure href and xlink:href are validated as URIs (javascript: stripped)
            sanitizer.UriAttributes.Add("href");
            sanitizer.UriAttributes.Add("xlink:href");
            return sanitizer;
        }

        /// <summary>
        /// Sanitizes raw SVG markup. Removes script, event handlers, foreignObject, and other dangerous content.
        /// </summary>
        /// <param name="rawSvg">Raw SVG string (e.g. from uploaded file).</param>
        /// <returns>Sanitized SVG string, or null if input is null/empty or result is invalid/empty.</returns>
        public static string? Sanitize(string? rawSvg)
        {
            if (string.IsNullOrWhiteSpace(rawSvg))
                return null;

            var sanitized = Sanitizer.Value.Sanitize(rawSvg);
            if (string.IsNullOrWhiteSpace(sanitized))
                return null;
            // Must contain at least an svg root for valid SVG
            if (!sanitized.TrimStart().StartsWith("<svg", StringComparison.OrdinalIgnoreCase) &&
                !sanitized.Contains("<svg", StringComparison.OrdinalIgnoreCase))
                return null;
            return sanitized;
        }
    }
}
