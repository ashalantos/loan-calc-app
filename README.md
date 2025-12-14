# Home Loan Calculator App 🏠💰

A modern, interactive web application to help you calculate home loan EMI and understand your loan repayment options.

## Features

### 1. **EMI Calculator** 📊
- Calculate monthly EMI for your home loan
- Enter principal amount, annual interest rate, and loan duration (years + months)
- View EMI breakdown into principal and interest portions
- Compare EMI across different loan durations (5, 10, 15, 20, 25 years)
- Get recommendations on the best repayment option
- Generate detailed month-by-month amortization reports for any duration

### 2. **Remaining Loan Calculator** 📈
- Calculate the remaining loan duration based on your current EMI
- Explore the impact of paying additional amounts
- Compare scenarios: Current EMI vs Additional Payment
- See interest savings and time saved
- Generate detailed amortization reports for both scenarios

### 3. **Amortization Reports** 📋
- Detailed month-by-month breakdown with:
  - Month/Year
  - EMI Paid
  - Amount to Interest
  - Amount to Principal
  - Remaining Principal Balance
  - Cumulative Interest Paid
- Reports available for:
  - Different loan durations in EMI Calculator
  - Current EMI scenario in Remaining Loan Calculator
  - Additional payment scenario in Remaining Loan Calculator

## Live Demo

🌐 **Access the app here:** [https://ashalantos.github.io/loan-calc-app/](https://ashalantos.github.io/loan-calc-app/)

## How to Use

### EMI Calculator Tab
1. Enter your loan principal amount (₹)
2. Enter annual interest rate (%)
3. Enter loan duration (years and/or months)
4. Click "Calculate EMI"
5. View your monthly EMI and breakdown
6. Check the comparison table for different durations
7. Click "📋 Report" button for any duration to see detailed amortization

### Remaining Loan Calculator Tab
1. Enter current outstanding principal (₹)
2. Enter annual interest rate (%)
3. Enter your current EMI (₹)
4. Click "Calculate Remaining Loan"
5. View how many years it will take to close the loan
6. Enter an additional amount you can pay per month
7. Click "Calculate Impact" to see the difference
8. Click the report buttons to view detailed amortization schedules

## Installation

### Option 1: Clone and Open Locally
```bash
git clone https://github.com/ashalantos/loan-calc-app.git
cd loan-calc-app
# Open index.html in your web browser
```

### Option 2: Use GitHub Pages
The app is already deployed on GitHub Pages and can be accessed at:
[https://ashalantos.github.io/loan-calc-app/](https://ashalantos.github.io/loan-calc-app/)

## Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Calculations and interactivity
- **No external dependencies** - Pure frontend application

## Features Highlight

✅ **Accurate EMI Calculation** - Uses standard loan EMI formula
- EMI = P × [R(1+R)^N] / [(1+R)^N - 1]
- P = Principal, R = Monthly Interest Rate, N = Number of Months

✅ **Flexible Duration Input** - Support for years and months
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Real-time Calculations** - Instant results as you enter data
✅ **Detailed Reports** - Month-by-month amortization schedules
✅ **User-friendly Interface** - Clean, modern, and intuitive design

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Files Structure

```
loan-calc-app/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript logic and calculations
└── README.md       # This file
```

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

If you have any questions or suggestions, please feel free to open an issue on GitHub.

---

**Happy Loan Calculating!** 🎉

Built with ❤️ by [ashalantos](https://github.com/ashalantos)
