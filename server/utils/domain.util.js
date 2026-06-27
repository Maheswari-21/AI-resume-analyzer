exports.detectDomain = function (text) {
  const t = text.toLowerCase();

  if (t.match(/javascript|react|node|sql|api|developer/)) return "it";
  if (t.match(/marketing|seo|brand|campaign/)) return "marketing";
  if (t.match(/account|finance|gst|audit|tax/)) return "finance";
  if (t.match(/hr|recruit|talent|onboarding/)) return "hr";
  if (t.match(/nurse|patient|clinical|hospital/)) return "healthcare";

  return "general";
};