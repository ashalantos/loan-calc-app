# Test Specifications for Home Loan Calculator App

## Overview
This document describes the automated tests that are generated and executed during the CI/CD deployment process. All test code is generated dynamically using Playwright during deployment - no test code files are stored in the repository.

## Test Environment
- Framework: Playwright (Auto-generated)
- Browsers: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- Execution: Automated on every push to main branch
- Requirement: All tests MUST pass before deployment to GitHub Pages

---

## Test Suite 1: EMI Calculator Validation

### Test Name: "EMI Calculator - Calculate and Verify Results"

### Purpose
Verify that the EMI Calculator tab functions correctly and produces accurate calculations.

### Test Steps
1. Navigate to the application at https://ashalantos.github.io/loan-calc-app/
2. Access the "EMI Calculator" tab
3. Enter the following values:
   - Principal Amount: ₹5,000,000
   - Annual Interest Rate: 7.5%
   - Loan Duration: 20 years, 0 months
4. Click the "Calculate EMI" button
5. Wait for results to load

### Expected Validations
- ✓ EMI value is displayed and formatted as currency (₹)
- ✓ EMI value is greater than 0
- ✓ "To Principal" breakdown is visible and contains ₹ symbol
- ✓ "To Interest" breakdown is visible and contains ₹ symbol
- ✓ EMI Comparison table is displayed with multiple duration options
- ✓ Best Option section is visible with recommendation
- ✓ All comparison rows show valid EMI calculations

### Failure Criteria
- EMI value is not displayed
- EMI value is 0 or negative
- Breakdown values are missing
- Comparison table is empty
- No recommendation is shown

---

## Test Suite 2: Remaining Loan Calculator with Additional Payment Impact

### Test Name: "Remaining Loan Calculator - Calculate and Verify Impact"

### Purpose
Verify that the Remaining Loan Calculator correctly computes loan payoff scenarios and the impact of additional payments.

### Test Steps
1. Navigate to the "Remaining Loan" tab
2. Enter the following values:
   - Current Outstanding Principal: ₹3,000,000
   - Annual Interest Rate: 7.5%
   - Current EMI: ₹25,000
3. Click "Calculate Remaining Loan" button
4. Wait for results
5. Enter Additional EMI Amount: ₹5,000
6. Click "Calculate Impact" button
7. Wait for comparison results

### Expected Validations
- ✓ Current EMI is displayed correctly (₹25,000)
- ✓ Years to Complete is calculated and displayed (greater than 0)
- ✓ Original EMI Amount matches input (₹25,000)
- ✓ New EMI Amount is calculated correctly (₹30,000 = ₹25,000 + ₹5,000)
- ✓ New EMI is higher than Original EMI
- ✓ Time to Complete with new EMI is less than with original EMI
- ✓ Interest Saved amount is displayed (positive value)
- ✓ Recommendation section provides clear guidance

### Failure Criteria
- Loan calculation is incorrect
- EMI values don't match inputs
- New EMI is not higher than original
- Time saved is not calculated
- Comparison section is not displayed
- Recommendation is empty

---

## Test Suite 3: Amortization Report Generation and Verification

### Test Name: "Amortization Report - Generate and Verify Table"

### Purpose
Verify that amortization reports generate correctly with all required columns and accurate data.

### Test Steps
1. Navigate to "EMI Calculator" tab
2. Enter the following values:
   - Principal Amount: ₹4,000,000
   - Annual Interest Rate: 8%
   - Loan Duration: 15 years, 0 months
3. Click "Calculate EMI" button
4. Click any "📋 Report" button from the comparison table
5. Wait for the Reports tab to open and load

### Expected Validations
- ✓ App automatically switches to Reports & Charts tab
- ✓ Report Summary is displayed with:
  - Principal Amount (₹4,000,000)
  - Annual Interest Rate (8%)
  - Monthly EMI (formatted as ₹)
  - Total Duration (15 years)
- ✓ Amortization table is visible with header row containing 6 columns:
  1. Month/Year
  2. EMI Paid
  3. To Interest
  4. To Principal
  5. Remaining Principal
  6. Remaining Interest
- ✓ Table contains at least 180 rows (15 years × 12 months)
- ✓ Each row has 6 data cells with valid values
- ✓ Month/Year format is valid (e.g., "Jan 2024", "Feb 2024")
- ✓ All currency values are formatted with ₹ symbol
- ✓ Remaining Principal decreases with each row
- ✓ Final row shows Remaining Principal ≈ 0

### Failure Criteria
- Report doesn't generate
- Tab doesn't switch to Reports
- Report summary is missing data
- Table has fewer than 2 rows
- Columns are missing
- Currency formatting is incorrect
- Calculations appear incorrect (Principal increasing instead of decreasing)

---

## Test Execution & Reporting

### When Tests Run
- On every push to the main branch
- Before any deployment to GitHub Pages occurs

### What Happens on Test Failure
- ❌ Tests fail and block deployment
- ❌ GitHub Pages is NOT updated with new code
- ❌ Error report is generated and published
- ❌ Developer is notified through GitHub Actions

### What Happens on Test Success
- ✅ All 3 test suites pass
- ✅ Code is automatically deployed to GitHub Pages
- ✅ Test report is generated and archived
- ✅ Live app is updated within 1-2 minutes

### Test Reports Generated
- HTML Report: Interactive test report with screenshots on failure
- JUnit Report: Machine-readable test results (XML format)
- JSON Report: Detailed test data for analysis
- Video Recordings: For any failed tests (MP4 format)
- Screenshots: On-failure screenshots for debugging

---

## Notes
- All test code is generated dynamically during CI/CD pipeline execution
- Tests are designed to be robust and account for UI rendering delays
- Mobile browsers are tested separately to ensure responsive design works
- Test execution time typically: 5-10 minutes depending on load
- Tests validate functionality across multiple browsers for compatibility
