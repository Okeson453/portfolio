#!/bin/bash
# Task 23: Manual Screen Reader Testing Script
# 
# NVDA (Windows) & VoiceOver (macOS) Accessibility Testing
# This guide provides step-by-step testing procedures to validate
# all accessibility improvements from Tasks 1-22
#
# Test Duration: ~1 hour per screen reader
# Prerequisites: NVDA (Windows) or VoiceOver (macOS) enabled
# Browser: Chrome or Safari (best for screen reader support)

# ==============================================================================
# PART 1: ENVIRONMENT SETUP
# ==============================================================================

echo "=== TASK 23: Manual Screen Reader Testing ==="
echo ""
echo "STEP 1: Install Screen Readers"
echo ""
echo "Windows (NVDA):"
echo "  1. Download: https://www.nvaccess.org/download/"
echo "  2. Install: Run installer, accept defaults"
echo "  3. Launch: NVDA will start automatically after install"
echo "  4. Verify: NVDA should announce 'Welcome to NVDA'"
echo ""
echo "macOS (VoiceOver - Built-in):"
echo "  1. Enable: System Preferences → Accessibility → VoiceOver → Enable"
echo "  2. Test: VO key = Ctrl+Option"
echo "  3. Web rotor: VO+U to open Web Rotor"
echo ""
echo "STEP 2: Start Local Dev Server"
echo ""
echo "  npm run dev"
echo ""
echo "  Wait for: 'Local: http://localhost:3000/'"
echo ""

# ==============================================================================
# PART 2: TEST SCRIPTS
# ==============================================================================

cat > /tmp/nvda_voiceover_tests.md << 'EOF'
# Screen Reader Testing Checklist

## TEST ENVIRONMENT

**Test Framework:** Manual testing with NVDA (Windows) or VoiceOver (macOS)
**Browser:** Chrome (NVDA) or Safari (VoiceOver)
**Test Date:** [Date]
**Tester Name:** [Name]
**Screen Reader Version:** [e.g., NVDA 2024.2, VoiceOver on macOS 14.3]

---

## ROUTE 1: HOME PAGE (`/`)

### 1.1 Skip Link — Bypass Blocks (WCAG 2.4.1)

#### Test Procedure (NVDA):
1. Navigate to home page
2. Press Tab once to reach first element  
3. Expected: Hear "Link, Skip to main content"
4. Press Enter
5. Expected: Focus moves to `<main>` landmark
6. Verify: Screen reader announces "Main landmark" or similar

#### Test Procedure (VoiceOver):
1. Navigate to home page
2. Press VO+Right Arrow to navigate elements
3. Expected: "Skip to main content, button"
4. Press VO+Space to activate
5. Expected: Focus announcement shows main content region

#### Evidence to Document:
- [ ] Skip link is the first focusable element
- [ ] Skip link has clear, descriptive text ("Skip to main content")
- [ ] Skip link jumps to `<main>` element
- [ ] Focus is announced after skip (no silent focus)

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 1.2 Navigation Menu — Keyboard Navigation (WCAG 2.1.1)

#### Test Procedure (NVDA):
1. Tab to Navigation menu button (Header area)
2. Expected: Hear "Navigation, button" or "Menu, button"
3. Press Enter to open menu
4. Expected: Hear "Menu, button, pressed" or "Menu expanded"
5. Press Down Arrow
6. Expected: Focus moves to first menu item, hear item name (e.g., "About")
7. Press Down Arrow again
8. Expected: Focus to next menu item (e.g., "Projects")
9. Press Up Arrow
10. Expected: Focus back to previous item
11. Press Home
12. Expected: Focus jumps to first menu item
13. Press End
14. Expected: Focus jumps to last menu item
15. Press Escape
16. Expected: Menu closes, focus returns to trigger button

#### Test Procedure (VoiceOver):
1. VO+Right Arrow to unlock screen reader navigation
2. VO+Down Arrow to navigate to menu button
3. VO+Space to open menu
4. VO+Down Arrow to navigate items
5. VO+Up Arrow to reverse direction
6. Test Home/End keys (may require VO modifier combos)
7. Press Escape to close

#### Evidence to Document:
- [ ] All menu items are keyboard navigable
- [ ] Arrow Down/Up moves between items
- [ ] Home jumps to first item
- [ ] End jumps to last item
- [ ] Escape closes menu and returns focus to trigger
- [ ] Current menu item is announced

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 1.3 Focus Indicators — Visible on All Interactive Elements (WCAG 2.4.7)

#### Test Procedure (NVDA):
1. Press Tab to navigate through all elements
2. At each element (button, link, input), verify:
   - Expected: Blue outline (2px) appears around element
   - Expected: Screen reader continues announcing "Button, [name]"
3. Test on light background
4. Expected: Outline clearly visible (high contrast)
5. Test on dark background (scroll to dark section)
6. Expected: Outline still visible

#### Test Procedure (VoiceOver):
1. Use VO+Right Arrow to navigate
2. Visual check: Look for focus ring (VoiceOver shows border)
3. Verify visibility on both light and dark backgrounds

#### Evidence to Document:
- [ ] All buttons have visible focus outline
- [ ] All links have visible focus outline
- [ ] All form inputs have visible focus outline
- [ ] Focus outline visible on light backgrounds
- [ ] Focus outline visible on dark backgrounds
- [ ] Focus outline is 2px+ width (easy to see)

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 1.4 Heading Hierarchy — Proper Structure (WCAG 1.3.1)

#### Test Procedure (NVDA):
1. Access heading list: Press H to jump between headings
2. Expected sequence:
   - H1: "Secure Stack Portfolio" (or page title)
   - H2: "Featured Projects" or first section heading
   - H2: Next section heading
   - No H3 should appear before H2
3. Verify: H1 appears only once
4. Verify: No skipped levels (no H1 → H3 jump)

#### Test Procedure (VoiceOver):
1. Open Web Rotor: VO+U
2. Select "Headings" from list
3. Navigate through headings with arrows
4. Verify order and proper hierarchy

#### Evidence to Document:
- [ ] Exactly one H1 on page
- [ ] H1 is page title
- [ ] Heading hierarchy is logical (H1 → H2 → H2, not H1 → H3)
- [ ] Section headings use same level (all H2, all H3)
- [ ] No skipped levels

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 1.5 Images — Descriptive Alt Text (WCAG 1.1.1)

#### Test Procedure (NVDA):
1. Navigate to Projects section (has images)
2. When reaching image:
   - Expected: Hear alt text (e.g., "Screenshot: Vulnerability scanner interface showing active port scan")
   - NOT: Hear "Image, [filename]" or blank
3. Verify: Alt text describes image content meaningfully
4. Verify: Alt text is ~10–15 words (not too long, not too short)

#### Test Procedure (VoiceOver):
1. Navigate to image with VO+Right Arrow
2. Expected: Hear alt text clearly
3. Verify: Accessibility Inspector shows alt text (VO+? and search "image")

#### Evidence to Document:
- [ ] All images have alt text (no blanks)
- [ ] Alt text is descriptive (not just "photo" or "image")
- [ ] Alt text is ~10–15 words (concise but informative)
- [ ] Alt text doesn't start with "Image of" or "Picture of"
- [ ] Decorative images have empty alt text (alt="")

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## ROUTE 2: CONTACT PAGE (`/contact`)

### 2.1 Form Labels — Proper Association (WCAG 1.3.1)

#### Test Procedure (NVDA):
1. Tab to Name input field
2. Expected: Hear "Edit text, Name" (or "Name input, required")
3. Tab to Email field
4. Expected: Hear "Edit text, Email" and confirmation it's marked required
5. Tab to Message field
6. Expected: Hear "Edit text, Message, required"
7. Tab away from field (without entering text)
8. Expected: If field was updated, error message is announced

#### Test Procedure (VoiceOver):
1. Navigate to each form input with VO+Right Arrow
2. Expected: VO announces "Label Name, text input" or similar structure
3. Verify: Label is clearly associated with input
4. Check Inspector: VO+? and verify aria-labelledby or htmlFor attribute

#### Evidence to Document:
- [ ] All form inputs have associated labels
- [ ] Labels are announced when input is focused
- [ ] "Required" attribute is announced
- [ ] Label text matches input purpose
- [ ] Field type is announced (email, text, etc.)

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 2.2 Form Validation — Real-Time Feedback (WCAG 3.3.4)

#### Test Procedure (NVDA):
1. Focus Name field
2. Type only 1 character, then Tab away
3. Expected: Hear "Error message: Name must be at least 2 characters"
4. Verify: Error is in red text AND announced via aria-live region
5. Type valid name: "John Smith"
6. Expected: Error disappears, hear clarification
7. Tab to Email field
8. Type invalid email: "notanemail"
9. Tab away
10. Expected: Hear "Error message: Invalid email format"
11. Type valid email: "john@example.com"
12. Expected: Visual and audible confirmation of correction

#### Test Procedure (VoiceOver):
1. Follow same steps as NVDA
2. Verify: Dialog announcements (aria-live) are heard
3. Check: Error colors are not relied upon alone

#### Evidence to Document:
- [ ] Real-time validation errors are announced
- [ ] Errors don't require form submission
- [ ] Error messages are descriptive (not "Invalid")
- [ ] Suggested fixes are provided (if applicable)
- [ ] Success confirmation is announced after valid input
- [ ] Errors are visual (red border) AND announced (aria-live)

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### 2.3 Form Submission — Confirmation & Status (WCAG 4.1.3)

#### Test Procedure (NVDA):
1. Fill out all fields with valid data:
   - Name: "Test User"
   - Email: "test@example.com"
   - Subject: "Testing accessibility"
   - Message: "This is a test of the form submission flow"
2. Tab to Submit button
3. Expected: Hear "Button, Submit"
4. Press Enter
5. Expected: Hear "Submitting..." (if there's a loading spinner)
6. Wait for server response (~2–5 seconds)
7. Expected: Hear announcement like "Your message was sent successfully" or form shows success state
8. Verify: Form resets to empty state
9. Verify: Success message stays visible for ~5 seconds (enough to read)

#### Test Procedure (VoiceOver):
1. Same form entry steps
2. Activate Submit button
3. Expected: Loading state is announced
4. Expected: Success message is announced after submission
5. Verify: Success announcement uses role="alert" or aria-live

#### Evidence to Document:
- [ ] Submit button has descriptive text ("Submit", not "OK")
- [ ] Loading state is announced (aria-busy or role="status")
- [ ] Success message is announced automatically
- [ ] Success message appears visually (not just announced)
- [ ] Form clears after successful submission
- [ ] User can resubmit without page reload

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## ROUTE 3: SKILLS PAGE (Dark Mode Testing)

### 3.1 Dark Mode — Color Contrast in Dark Theme (WCAG 1.4.3)

#### Test Procedure (Manual Visual Check):
1. Navigate to Skills page
2. Locate theme toggle (usually header, might show ☀️ or 🌙)
3. Activate dark mode (click toggle)
4. Page should switch to dark theme
5. Check all text for readability:
   - Headings: Should be white or very light gray
   - Body text: Should be light gray (not medium gray)
   - Special text (skill tags): Should have sufficient contrast
6. Expected visual result: All text easily readable on dark background

#### NVDA Verification (Contrast Check):
1. While in dark mode, navigate to different text elements
2. Use NVDA's color tools (not built-in, but you can visually inspect)
3. Common issue: Gray-500 text on dark background = FAIL
4. Should be: Gray-400 or lighter text

#### Evidence to Document:
- [ ] All text is readable in dark mode
- [ ] Headings have sufficient contrast (≥7:1)
- [ ] Body text has sufficient contrast (≥4.5:1)
- [ ] Links have sufficient contrast (≥4.5:1)
- [ ] No text appears "washed out" or hard to read
- [ ] Color alone is not the only way to convey information

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## ROUTE 4: PROJECTS PAGE (Image & Interactive Elements)

### 4.1 Project Cards — Interactive States (WCAG 2.1.1)

#### Test Procedure (NVDA):
1. Navigate to Projects section
2. Tab through each project card
3. For each card:
   - Expected: Hear "Button, [Project Name]" or "Link, [Project Name]"
   - Expected: Focus outline visible around card
4. Press Enter on a project
5. Expected: Navigate to project detail page OR modal opens
6. If modal opens:
   - Expected: Focus moves into modal
   - Expected: Modal title is announced
   - Expected: Can read project details via Tab
7. Close modal (Escape key)
8. Expected: Focus returns to triggering project card

#### Test Procedure (VoiceOver):
1. VO+Right Arrow to navigate cards
2. Verify: Card titles are announced
3. Verify: Status ("Link", "Button") is announced
4. VO+Space to activate project
5. Verify: Modal opens and is announced
6. Test Escape to close

#### Evidence to Document:
- [ ] All project cards are keyboard accessible
- [ ] Card titles are announced clearly
- [ ] Focus moves to/from modals properly
- [ ] Modal title is announced when opened
- [ ] Escape key closes modal
- [ ] Focus returns to triggering element after close

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## ROUTE 5: BLOG PAGE (List Navigation & Links)

### 5.1 Blog Post Links — Unique Link Text (WCAG 2.4.4)

#### Test Procedure (NVDA):
1. Navigate to Blog page
2. Press L to jump to next link
3. Expected: Hear "Link, [Blog Post Title]" (descriptive, not "Read More")
4. Verify: Each link text is unique (not repeating "Read More" multiple times)
5. Tab through blog post metadata:
   - Expected: Hear author name (if provided)
   - Expected: Hear publish date
   - Expected: Hear tags

#### Test Procedure (VoiceOver):
1. Open Web Rotor: VO+U
2. Select "Links"
3. Navigate through links
4. Verify: Each link has unique, descriptive text
5. Close Web Rotor with Escape

#### Evidence to Document:
- [ ] All blog post links have descriptive text
- [ ] No "Read More" or "Click here" links used alone
- [ ] Link text clearly describes target (e.g., "Understanding CSRF Attacks")
- [ ] Metadata (date, author) is announced separately
- [ ] Links are visually distinct from body text

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## ROUTE 6: ABOUT PAGE (Content Readability)

### 6.1 Content Structure — Logical Reading Order (WCAG 1.3.2)

#### Test Procedure (NVDA):
1. Press Home to go to top of page
2. Press Down Arrow multiple times to read through content
3. Expected: Content flows logically (intro → background → experience → skills)
4. Press H to jump between headings
5. Expected: Section headings appear in order
6. If page has sidebar or aside content:
   - Expected: NVDA announces "Navigation", "Complementary", or "Region" labels
   - Verify: Sidebar content is read at appropriate point (not mixed with main content)

#### Test Procedure (VoiceOver):
1. Navigate with VO+Right Arrow through whole page
2. Verify: Content reads smoothly from top to bottom
3. Verify: Sidebars are labeled and separated from main content
4. Check: Lists and tables are properly announced

#### Evidence to Document:
- [ ] Content reads in logical order from top to bottom
- [ ] Section headings are announced in sequence
- [ ] No content order jumps or confusing reordering
- [ ] Lists are announced as lists (not just lines)
- [ ] Blockquotes or special content types are announced
- [ ] Sidebar content is clearly labeled and separated

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## COMPREHENSIVE TESTS (All Routes)

### TEST 7: Lists — Proper Semantic structure (WCAG 1.3.1)

#### Test Procedure:
1. Find any bulleted or numbered list on site
2. Expected NVDA announcement: "List with X items"
3. Tab through list items
4. Expected: Each item announced as "List item, [Content]"
5. No bullet points should be manually typed (* or -)
6. All lists should use proper `<ul>` or `<ol>` tags

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### TEST 8: Buttons vs Links — Correct Semantic (WCAG 4.1.2)

#### Test Procedure:
1. Navigate through page with Tab
2. When reaching onclick elements:
   - Internal navigation → Should be `<a>` (announced as "Link")
   - Actions like "Submit", "Delete", "Open Modal" → Should be `<button>`
3. Verify: NVDA announces "Button" for buttons, "Link" for links
4. No links used without href attribute
5. No buttons used for navigation (use `<a>` instead)

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### TEST 9: Icons & Buttons — Aria Labels (WCAG 1.3.1, 4.1.2)

#### Test Procedure:
1. Find icon-only buttons (e.g., Close ✕, Menu ☰, Theme toggle 🌙)
2. Tab to each icon button
3. Expected NVDA: Hear descriptive label (e.g., "Close menu button", not just "Button")
4. Expected: Icon buttons should have `aria-label="Close menu"` or similar
5. No icon buttons should have empty or generic labels

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

### TEST 10: Error Messages — Associated & Announced (WCAG 3.3.4, 4.1.3)

#### Test Procedure:
1. Navigate to any form with validation
2. Intentionally trigger an error:
   - Leave required field empty
   - Enter invalid data (e.g., invalid email)
   - Submit form
3. Expected: Error message is announced automatically (not silent)
4. Expected: Error message is visually red and near the field
5. Expected: error message uses role="alert" (changes are announced immediately)
6. Fix the error
7. Expected: Error disappears and success is announced

**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

---

## SUMMARY & FINAL CHECKS

### Checklist for Document Completion:

- [ ] All 10 main tests completed
- [ ] At least 2 screen readers tested (NVDA + VoiceOver)
- [ ] All routes covered (Home, Contact, Skills, Projects, Blog, About)
- [ ] Both light and dark modes tested
- [ ] Keyboard-only navigation tested (no mouse)
- [ ] At least one complete form submission tested
- [ ] All WCAG 2.2 AA criteria verified

### Testing Sign-Off:

**Tester Name:** ________________  
**Date:** ________________  
**Screen Readers Tested:** ☐ NVDA ☐ VoiceOver  
**Overall Status:** ☐ PASS ☐ PARTIAL ☐ FAIL  
**Issues Found:** _______________  
**Remediation Status:** _______________  

---

## Appendix: Quick Command Cheat Sheets

### NVDA Quick Keys:
- **H** = Next heading
- **L** = Next list
- **T** = Next table
- **B** = Next button
- **NVDA+F1** = Welcome dialog
- **Ctrl+Home** = Start of page
- **Ctrl+End** = End of page
- **Down Arrow** = Read next line
- **Up Arrow** = Read previous line
- **Ctrl** = Stop speaking

### VoiceOver Quick Keys (macOS):
- **VO = Ctrl+Option (lock VO with button)**
- **VO+Right Arrow** = Next item
- **VO+Left Arrow** = Previous item
- **VO+U** = Open Web Rotor (headings, links, etc.)
- **VO+Space** = Activate button/link
- **VO+Down Arrow** = Read section/paragraph
- **VO+Up Arrow** = Read up
- **Escape** = Exit menus/dialogs
- **VO+H** = VoiceOver help menu

EOF

cat /tmp/nvda_voiceover_tests.md
