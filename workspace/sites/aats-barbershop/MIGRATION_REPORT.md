# Migration Report: Aat's Barbershop

**Date**: 2026-03-04
**Source URL**: https://aatsbarbershop.nl/
**City**: Alphen aan den Rijn
**Original CMS**: PHP (hand-coded, early 2000s style)

---

## Summary

Redesigned ultra-minimal PHP-based site (index.php, prijzen.php) from plain text early-2000s style to modern single-page HTML with:
- **Romanian primary language** with English toggle (per client request)
- Modern styling with luxury gold accent (#c9a961) and Playfair Display serif font
- Responsive mobile-first design
- Hero image slider with 4 original banner images
- All original content preserved from source

---

## Content Verification

### Business Information
- ✅ **Name**: Aat's Barbershop (verified from source)
- ✅ **Address**: Raadhuisstraat 257, 2406 AD Alphen a/d Rijn (verified from footer)
- ✅ **Phone**: 0172-475 339 (verified from footer)
- ✅ **Email**: info@aatsbarbershop.nl (verified from source)
- ✅ **Years in business**: 51+ years (verified from source-index.html line 54)

### Opening Hours (from source-index.html lines 66-75)
- ✅ **Dinsdag**: 8:30 - 17:30 uur
- ✅ **Woensdag**: 8:30 - 13:30 uur
- ✅ **Donderdag**: 8:30 - 17:30 uur
- ✅ **Vrijdag**: 8:30 - 17:30 uur
- ✅ **Zaterdag**: 8:30 - 14:30 uur

### Services & Prices (from source-prijzen.html lines 61-99)
All 10 services with exact prices preserved:
- ✅ Knippen: € 27,50
- ✅ Knippen 65+: € 26,-
- ✅ Tondeuse 1 stand: € 18,-
- ✅ Tondeuse 65+: € 17,50
- ✅ Wassen: € 3,50
- ✅ Knippen 0 t/m 3 jaar: € 23,50
- ✅ Knippen 4 t/m 12 jaar: € 25,-
- ✅ Knippen + Baard: € 33,-
- ✅ Knippen + Baard 65+: € 31,50
- ✅ Baard trimmen/knippen: vanaf € 9,50

### Appointment Policy
- ✅ **Verified from source**: "Wij werken op afspraak, gaarne via de mail" (line 147)
- ✅ **Email contact**: info@aatsbarbershop.nl
- ✅ **Note**: "(svp niet bellen)" / "(please do not call)" preserved

---

## QA+FIXER Fixes Applied

### SEO Enhancements
1. ✅ Added `<meta name="robots" content="index, follow">`
2. ✅ Added `<link rel="canonical" href="https://aatsbarbershop.nl/">`
3. ✅ Added Open Graph tags (og:url, og:site_name, og:locale, og:image)
4. ✅ Added Twitter Card meta tags (summary_large_image)
5. ✅ Added JSON-LD structured data (@type: BarberShop)
   - Business info, geo coordinates, opening hours
   - Service catalog with prices

### Accessibility Fixes
1. ✅ Added skip link ("Sari la conținut" / "Skip to content")
2. ✅ Added `<main id="main-content">` wrapper
3. ✅ Added `role="navigation"` and `aria-label="Navigare principală"` to nav
4. ✅ Semantic HTML structure (header, nav, main, section, footer)
5. ✅ Alt text for all images

### Assets Management
- ✅ Moved 4 banner images to `assets/` folder:
  - assets/banner.jpg (926 KB)
  - assets/banner2.jpg (1.1 MB)
  - assets/banner3.jpg (1.1 MB)
  - assets/banner5.jpg (1.1 MB)
- ✅ Updated all image paths in HTML and meta tags to use `assets/` prefix
- ✅ Updated OG/Twitter image URLs to absolute paths

### Language Implementation
- ✅ **Primary language**: Romanian (lang="ro")
- ✅ **Secondary language**: English toggle
- ✅ Language switcher in top-right corner (RO/EN buttons)
- ✅ Dynamic content switching via JavaScript
- ✅ Content tagged with `data-lang` attributes

---

## Design Decisions

### Why Service Names Stay Dutch
**Decision**: Keep service names in Dutch (Knippen, Tondeuse, Wassen, Baard trimmen)
**Rationale**:
1. Original site is in Dutch market (Netherlands)
2. Service names are industry-standard terms clients recognize
3. Changing "Knippen" → "Tuns" or "Haircut" could confuse local clientele
4. Pricing is factual data from source, not translated copy

### Romanian Translation Strategy
- Business description translated to Romanian
- UI elements translated (navigation, section titles, CTA)
- Service names kept as Dutch (industry terms)
- Appointment notice translated
- Day names kept as Dutch (calendar standard in NL)

---

## Files Delivered

1. **index.html** (26 KB) - Single-page site with Romanian/English toggle
2. **data.json** - Structured business data
3. **source-index.html** - Original homepage backup
4. **source-prijzen.html** - Original prices page backup
5. **assets/** - 4 banner images (4.3 MB total)
6. **MIGRATION_REPORT.md** - This report

---

## Technical Stack

- **HTML5** with semantic markup
- **CSS3** with custom properties, flexbox, grid
- **Vanilla JavaScript** for slider + language toggle
- **Google Fonts**: Playfair Display (serif) + Inter (sans-serif)
- **Self-contained**: All CSS/JS inline, no external dependencies
- **Mobile-first**: Responsive breakpoint at 768px

---

## Known Constraints

1. **No phone booking**: Client works by email appointment only (verified in source)
2. **Sparse original content**: Original site had minimal content, no photos of services/staff
3. **No social media**: No social links found in source
4. **Day names in Dutch**: Kept as-is for local market recognition

---

## Status

✅ **READY FOR DEPLOYMENT**
All content verified, SEO/a11y fixes applied, assets organized, self-contained single-file ready.
