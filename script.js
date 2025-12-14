// Utility Functions

/**
 * Calculate monthly EMI using the formula:
 * EMI = P × [R(1+R)^N] / [(1+R)^N - 1]
 * Where P = Principal, R = Monthly Interest Rate, N = Number of Months
 */
function calculateEMI(principal, annualRate, years) {
    if (principal <= 0 || annualRate < 0 || years <= 0) {
        return 0;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfMonths = years * 12;

    if (monthlyRate === 0) {
        return principal / numberOfMonths;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
        (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    return isFinite(emi) ? emi : 0;
}

/**
 * Calculate total interest for a given EMI
 */
function calculateTotalInterest(principal, emi, years) {
    return (emi * years * 12) - principal;
}

/**
 * Format number as currency
 */
function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Format number to 2 decimal places
 */
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

/**
 * Calculate remaining loan after given months
 */
function calculateRemainingLoan(principal, monthlyRate, emi, months) {
    if (monthlyRate === 0) {
        return Math.max(0, principal - (emi * months));
    }

    let remaining = principal;
    for (let i = 0; i < months; i++) {
        const interest = remaining * monthlyRate;
        remaining = remaining + interest - emi;
        if (remaining <= 0) {
            return 0;
        }
    }
    return Math.max(0, remaining);
}

/**
 * Calculate months to close a loan
 */
function calculateMonthsToClose(principal, monthlyRate, emi) {
    if (emi <= 0 || principal <= 0) {
        return 0;
    }

    if (monthlyRate === 0) {
        return Math.ceil(principal / emi);
    }

    if (emi <= principal * monthlyRate) {
        return Infinity; // EMI is not enough to cover interest
    }

    let months = 0;
    let remaining = principal;

    while (remaining > 0 && months < 600) { // 50 years max
        const interest = remaining * monthlyRate;
        remaining = remaining + interest - emi;
        months++;

        if (remaining <= 0) {
            return months;
        }
    }

    return months;
}

// ============================================
// TAB 1: EMI CALCULATOR
// ============================================

function calculateTab1() {
    const principal = parseFloat(document.getElementById('principal1').value);
    const interest = parseFloat(document.getElementById('interest1').value);
    const years = parseFloat(document.getElementById('years1').value) || 0;
    const months = parseFloat(document.getElementById('months1').value) || 0;

    // Validation
    if (isNaN(principal) || isNaN(interest)) {
        alert('Please fill in principal and interest rate');
        return;
    }

    if (principal <= 0 || interest < 0) {
        alert('Please enter valid values for principal and interest');
        return;
    }

    // Convert years and months to total years
    const totalYears = years + (months / 12);

    if (totalYears <= 0) {
        alert('Please enter loan duration (years and/or months)');
        return;
    }

    // Calculate EMI for the given duration
    const emi = calculateEMI(principal, interest, totalYears);
    const totalInterest = calculateTotalInterest(principal, emi, totalYears);
    const totalAmount = principal + totalInterest;

    // Display main EMI
    document.getElementById('emiValue').textContent = formatCurrency(emi);

    // Calculate average principal and interest per month
    const avgInterestPerMonth = (totalInterest / (totalYears * 12));
    const avgPrincipalPerMonth = emi - avgInterestPerMonth;

    // Display breakdown
    document.getElementById('avgPrincipal').textContent = formatCurrency(avgPrincipalPerMonth);
    document.getElementById('avgInterest').textContent = formatCurrency(avgInterestPerMonth);

    // Generate comparison table for different durations
    const durations = [5, 10, 15, 20, 25];
    // Add user's selected duration if not in the list
    if (!durations.includes(totalYears)) {
        durations.push(totalYears);
    }
    durations.sort((a, b) => a - b);

    let tableHTML = '';
    let bestOption = null;
    let minInterest = Infinity;

    durations.forEach((duration) => {
        if (duration <= totalYears) {
            const durationEMI = calculateEMI(principal, interest, duration);
            const durationInterest = calculateTotalInterest(principal, durationEMI, duration);
            const durationTotal = principal + durationInterest;

            const isSelected = duration === totalYears;
            const isBest = durationInterest < minInterest;

            if (isBest) {
                minInterest = durationInterest;
                bestOption = {
                    duration: duration,
                    emi: durationEMI,
                    interest: durationInterest,
                    total: durationTotal
                };
            }

            const rowClass = isBest ? 'best-row' : '';
            const badge = isBest ? '<span class="badge">✓ Best</span>' : '';

            // Format duration display
            const durationYears = Math.floor(duration);
            const durationMonths = Math.round((duration - durationYears) * 12);
            const durationDisplay = durationMonths > 0 ? `${durationYears}Y ${durationMonths}M` : `${durationYears} years`;

            tableHTML += `
                <tr class="${rowClass}">
                    <td>${durationDisplay}</td>
                    <td>${formatCurrency(durationEMI)}</td>
                    <td>${formatCurrency(durationInterest)}</td>
                    <td>${formatCurrency(durationTotal)}</td>
                    <td><button class="btn-report" onclick="generateAmortizationReportForDuration(${principal}, ${interest}, ${duration})">📋 Report</button></td>
                    <td>${badge}</td>
                </tr>
            `;
        }
    });

    document.getElementById('emiTableBody').innerHTML = tableHTML;

    // Display best option recommendation
    if (bestOption) {
        const savingsVsSelected = minInterest - (emi * totalYears * 12 - principal);
        
        // Format duration display for best option
        const bestYears = Math.floor(bestOption.duration);
        const bestMonths = Math.round((bestOption.duration - bestYears) * 12);
        const bestDurationDisplay = bestMonths > 0 ? `${bestYears} years ${bestMonths} months` : `${bestYears} years`;

        const bestOptionHTML = `
            <p>
                <strong>Recommended Duration:</strong> 
                <span class="highlight">${bestDurationDisplay}</span>
            </p>
            <p>
                <strong>Monthly EMI:</strong> 
                <span class="highlight">${formatCurrency(bestOption.emi)}</span>
            </p>
            <p>
                <strong>Total Interest:</strong> 
                <span class="highlight">${formatCurrency(bestOption.interest)}</span>
            </p>
            <p class="savings">
                💰 You save ${formatCurrency(Math.abs(savingsVsSelected))} compared to your selected duration
            </p>
        `;
        document.getElementById('bestOptionTab1').innerHTML = bestOptionHTML;
    }

    // Store data for report generation
    window.tab1Data = {
        principal: principal,
        annualRate: interest,
        emi: emi,
        years: totalYears
    };

    // Show results
    document.getElementById('tab1Results').style.display = 'block';
}

// ============================================
// TAB 2: REMAINING LOAN CALCULATOR
// ============================================

function calculateTab2() {
    const principal = parseFloat(document.getElementById('currentPrincipal').value);
    const interest = parseFloat(document.getElementById('currentInterest').value);
    const emi = parseFloat(document.getElementById('currentEmi').value);

    // Validation
    if (isNaN(principal) || isNaN(interest) || isNaN(emi)) {
        alert('Please fill in all fields');
        return;
    }

    if (principal <= 0 || interest < 0 || emi <= 0) {
        alert('Please enter valid values');
        return;
    }

    const monthlyRate = interest / 100 / 12;

    // Check if EMI is sufficient
    if (emi <= principal * monthlyRate && monthlyRate > 0) {
        alert('EMI is too low to cover the interest. Please enter a higher EMI.');
        return;
    }

    // Calculate months and years to complete
    const monthsToComplete = calculateMonthsToClose(principal, monthlyRate, emi);
    const yearsToComplete = (monthsToComplete / 12).toFixed(1);
    const totalInterest = (emi * monthsToComplete) - principal;

    // Display current info
    document.getElementById('currentEmiDisplay').textContent = formatCurrency(emi);
    document.getElementById('yearsToComplete').textContent = yearsToComplete;

    // Store values for additional payment calculation
    window.tab2Data = {
        principal: principal,
        interest: interest,
        monthlyRate: monthlyRate,
        currentEmi: emi,
        monthsToComplete: monthsToComplete,
        yearsToComplete: yearsToComplete,
        totalInterest: totalInterest
    };

    // Show results
    document.getElementById('tab2Results').style.display = 'block';

    // Reset additional payment section
    document.getElementById('additionalPayment').value = '';
    document.getElementById('additionalResults').style.display = 'none';
}

function calculateAdditionalPayment() {
    if (!window.tab2Data) {
        alert('Please calculate remaining loan first');
        return;
    }

    const additionalAmount = parseFloat(document.getElementById('additionalPayment').value);

    if (isNaN(additionalAmount) || additionalAmount < 0) {
        alert('Please enter a valid additional amount');
        return;
    }

    if (additionalAmount === 0) {
        alert('Please enter an additional amount greater than 0');
        return;
    }

    const data = window.tab2Data;
    const newEmi = data.currentEmi + additionalAmount;

    // Calculate months to complete with new EMI
    const newMonthsToComplete = calculateMonthsToClose(data.principal, data.monthlyRate, newEmi);
    const newYearsToComplete = (newMonthsToComplete / 12).toFixed(1);
    const newTotalInterest = (newEmi * newMonthsToComplete) - data.principal;

    // Calculate savings
    const monthsSaved = data.monthsToComplete - newMonthsToComplete;
    const yearsSaved = (monthsSaved / 12).toFixed(1);
    const interestSaved = data.totalInterest - newTotalInterest;

    // Determine best option
    let recommendation = '';
    if (interestSaved > 0) {
        recommendation = `
            <p>
                <strong style="color: var(--success-color);">✓ Paying additional amount is beneficial!</strong>
            </p>
            <p>
                By paying an additional <span class="highlight">${formatCurrency(additionalAmount)}</span> per month,
                you can close your loan in <span class="highlight">${newYearsToComplete} years</span> instead of 
                <span class="highlight">${data.yearsToComplete} years</span>.
            </p>
            <p>
                <strong>Time Saved:</strong> <span class="highlight">${yearsSaved} years (${monthsSaved} months)</span>
            </p>
            <p class="savings">
                💰 Interest Saved: ${formatCurrency(interestSaved)}
            </p>
        `;
    } else {
        recommendation = `
            <p>
                <strong style="color: var(--primary-color);">Additional payment won't change the loan duration significantly.</strong>
            </p>
        `;
    }

    // Update comparison display
    document.getElementById('originalEmiAmount').textContent = formatCurrency(data.currentEmi);
    document.getElementById('originalYears').textContent = data.yearsToComplete;
    document.getElementById('originalInterest').textContent = formatCurrency(data.totalInterest);

    document.getElementById('newEmiAmount').textContent = formatCurrency(newEmi);
    document.getElementById('newYears').textContent = newYearsToComplete;
    document.getElementById('newInterest').textContent = formatCurrency(newTotalInterest);

    document.getElementById('bestOptionTab2').innerHTML = recommendation;

    // Store data for report generation
    window.tab2ReportData = {
        principal: data.principal,
        annualRate: data.interest,
        currentEmi: data.currentEmi,
        newEmi: newEmi,
        monthlyRate: data.monthlyRate,
        monthsToComplete: data.monthsToComplete,
        newMonthsToComplete: newMonthsToComplete
    };

    // Show results
    document.getElementById('additionalResults').style.display = 'block';
}

// ============================================
// REMAINING LOAN AMORTIZATION REPORT
// ============================================

function generateRemainingLoanReport(reportType) {
    if (!window.tab2ReportData) {
        alert('Please calculate additional payment first');
        return;
    }

    const data = window.tab2ReportData;
    const principal = data.principal;
    const annualRate = data.annualRate;
    const monthlyRate = data.monthlyRate;
    
    let emi, totalMonths, reportTitle;

    if (reportType === 'current') {
        emi = data.currentEmi;
        totalMonths = data.monthsToComplete;
        reportTitle = 'Current EMI';
    } else {
        emi = data.newEmi;
        totalMonths = data.newMonthsToComplete;
        reportTitle = 'With Additional Payment';
    }

    // Display report info
    document.getElementById('reportPrincipal').textContent = formatCurrency(principal);
    document.getElementById('reportRate').textContent = annualRate.toFixed(2) + '%';
    document.getElementById('reportEmi').textContent = formatCurrency(emi);
    document.getElementById('reportDuration').textContent = reportTitle + ' (' + (totalMonths / 12).toFixed(1) + ' years)';
    document.getElementById('reportInfo').style.display = 'block';

    // Generate amortization table
    generateReportTable(principal, emi, monthlyRate, totalMonths);

    // Switch to tab3
    const tab3Button = document.querySelector('[data-tab="tab3"]');
    if (tab3Button) {
        tab3Button.click();
    }
}

// ============================================
// AMORTIZATION REPORT
// ============================================

function generateAmortizationReportForDuration(principal, annualRate, years) {
    // Calculate EMI for given parameters
    const emi = calculateEMI(principal, annualRate, years);
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    
    // Display report info
    document.getElementById('reportPrincipal').textContent = formatCurrency(principal);
    document.getElementById('reportRate').textContent = annualRate.toFixed(2) + '%';
    document.getElementById('reportEmi').textContent = formatCurrency(emi);
    document.getElementById('reportDuration').textContent = years + ' years';
    document.getElementById('reportInfo').style.display = 'block';

    // Generate amortization table
    generateReportTable(principal, emi, monthlyRate, totalMonths);

    // Switch to tab3
    const tab3Button = document.querySelector('[data-tab="tab3"]');
    if (tab3Button) {
        tab3Button.click();
    }
}

function generateReportTable(principal, emi, monthlyRate, totalMonths) {
    let tableHTML = '';
    let remainingPrincipal = principal;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    for (let month = 1; month <= totalMonths; month++) {
        // Calculate interest for this month
        const interestPayment = remainingPrincipal * monthlyRate;
        
        // Calculate principal payment
        let principalPayment = emi - interestPayment;

        // Handle last month rounding
        if (month === totalMonths) {
            principalPayment = remainingPrincipal;
        }

        // Update remaining principal
        const previousRemaining = remainingPrincipal;
        remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);

        // Calculate accumulated interest and principal
        totalInterestPaid += interestPayment;
        totalPrincipalPaid += principalPayment;

        // Format date
        const date = new Date();
        date.setMonth(date.getMonth() + month - 1);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        // Add row to table
        tableHTML += `
            <tr>
                <td>${monthYear}</td>
                <td>${formatCurrency(emi)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(remainingPrincipal)}</td>
                <td>${formatCurrency(Math.max(0, totalInterestPaid - interestPayment))}</td>
            </tr>
        `;
    }

    document.getElementById('reportTableBody').innerHTML = tableHTML;
    document.getElementById('reportTable').style.display = 'block';
    document.getElementById('noReport').style.display = 'none';
}

function generateAmortizationReport() {
    // Get data from tab1Data
    if (!window.tab1Data) {
        alert('Please calculate EMI first in the EMI Calculator tab');
        return;
    }

    const data = window.tab1Data;
    const principal = data.principal;
    const annualRate = data.annualRate;
    const emi = data.emi;
    const years = data.years;
    
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    // Display report info
    document.getElementById('reportPrincipal').textContent = formatCurrency(principal);
    document.getElementById('reportRate').textContent = annualRate.toFixed(2) + '%';
    document.getElementById('reportEmi').textContent = formatCurrency(emi);
    document.getElementById('reportDuration').textContent = years + ' years';
    document.getElementById('reportInfo').style.display = 'block';

    // Generate amortization table
    generateReportTable(principal, emi, monthlyRate, totalMonths);

    // Switch to tab3
    const tab3Button = document.querySelector('[data-tab="tab3"]');
    if (tab3Button) {
        tab3Button.click();
    }
}

// ============================================
// TAB SWITCHING
// ============================================

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function () {
        const tabId = this.getAttribute('data-tab');

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Remove active class from all content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked button
        this.classList.add('active');

        // Add active class to corresponding content
        document.getElementById(tabId).classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log('Loan Calculator App Loaded');
});
