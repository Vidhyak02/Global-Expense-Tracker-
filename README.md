# 🌍 Global Expense Tracker

### Track Your Expenses. Compare Your Spending. Manage Your Money.

**Global Expense Tracker** is a React-based expense management application designed to help users track and understand expenses across different countries.

The application provides separate expense tracking for **India** and the **USA**, a comparison view, money transfer functionality, login, and expense summary information through a simple and responsive interface.

🔗 **Live Demo:** [global-expense-tracker.netlify.app](https://global-expense-tracker.netlify.app/)

🔗 **GitHub Repository:** [Global Expense Tracker](https://github.com/Vidhyak02/Global-Expense-Tracker-)

---

## 📸 About the Project

Global Expense Tracker is a frontend web application developed using **React.js**.

The main goal of this project is to provide a simple platform for managing expenses and understanding spending across different countries.

**Users can:**

- Login to the application
- Track expenses in India
- Track expenses in the USA
- View expense summaries
- Compare expenses between India and the USA
- Manage money transfer information
- View expense-related details in an organized interface
- Navigate between different sections using React Router

---

## 🚀 Live Demo

👉 [https://global-expense-tracker.netlify.app/](https://global-expense-tracker.netlify.app/)

---

## ✨ Features

### 🔐 Login

The application includes a login page that allows users to access the expense tracker.

- User login interface
- Email and password fields
- Simple frontend authentication flow
- User-friendly form design

### 🇮🇳 India Expenses

The India Expenses page allows users to manage and view expense information related to India.

Users can:

- Add expense information
- View expense details
- Track spending
- Organize expenses
- View expense summaries

### 🇺🇸 USA Expenses

The USA Expenses page provides expense tracking for users dealing with expenses in the United States.

Users can:

- Add expense information
- View expense details
- Track spending
- Organize expenses
- View expense summaries

### 📊 Expense Comparison

The Comparison page helps users compare expense information between India and the USA.

It provides a simple way to understand differences in spending between the two countries.

### 💰 Money Transfer

The Money Transfer page provides an interface for managing transfer-related information.

Users can enter and view transfer details through the application.

### 📋 Expense Summary

The application includes reusable summary cards to display important expense information.

Summary information can include:

- Total expenses
- Income
- Balance
- Country-based expense information
- Other financial summary details

### 📱 Responsive Interface

The application is designed to provide a clean user experience across different screen sizes.

Supported devices include:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📱 Tablet

---

## 🛠️ Technologies Used

| Technology         | Usage                              |
| ------------------ | ---------------------------------- |
| React.js           | Frontend application development   |
| JavaScript         | Application logic                  |
| HTML5              | Page structure                     |
| CSS3               | Styling                            |
| React Router DOM   | Page navigation and routing        |
| React Hooks        | State and lifecycle management     |
| REST API           | Expense data handling              |
| Fetch API          | API communication                  |
| Git                | Version control                    |
| GitHub             | Source code hosting                |
| Netlify            | Application deployment             |

---

## 📁 Project Structure

```text
Global-Expense-Tracker/
│
├── src/
│   ├── components/
│   │   └── SummaryCard.js
│   │
│   ├── pages/
│   │   ├── Comparison.js
│   │   ├── Home.js
│   │   ├── IndiaExpenses.js
│   │   ├── Login.js
│   │   ├── MoneyTransfer.js
│   │   └── USAExpenses.js
│   │
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> **Note:** The `.env` file contains environment-specific configuration and should **not** be uploaded to GitHub.

---

## 🔑 Environment Variables

If your project uses environment variables for API configuration, create a `.env` file in the project root.

**Example:**

```env
REACT_APP_API_URL=YOUR_API_URL
```

Replace the value with your actual API URL.

### Important

- Do **not** upload sensitive API keys or private credentials to GitHub.
- Make sure your `.gitignore` contains:

```text
.env
```

- For Netlify deployment, configure the required environment variables in:

  **Netlify → Site Configuration → Environment Variables**

---

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Vidhyak02/Global-Expense-Tracker-.git
```

### 2. Open the Project

```bash
cd Global-Expense-Tracker-
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment File

Create a `.env` file in the project root and add the required environment variables:

```env
REACT_APP_API_URL=YOUR_API_URL
```

### 5. Start the Development Server

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

---

## 🌐 Deployment

The application is deployed using **Netlify**.

### Production Build

To create a production build:

```bash
npm run build
```

The optimized production files will be generated inside the `build/` folder.

### Netlify Configuration

| Setting            | Value          |
| ------------------ | -------------- |
| **Build command**  | `npm run build` |
| **Publish directory** | `build`     |

Make sure to configure the required environment variables in the Netlify project settings.

---

## 🔄 Application Flow

```text
Login
  ↓
Home
  ↓
Choose Expense Section
  ↓
India Expenses / USA Expenses
  ↓
View & Manage Expenses
  ↓
Expense Summary
  ↓
Comparison
  ↓
Money Transfer
```

---

## 📊 Main Pages

| Page              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| 🏠 **Home**       | Overview of the application and navigation to main features |
| 🔐 **Login**      | User login interface                                     |
| 🇮🇳 **India Expenses** | Manage and view India-related expenses               |
| 🇺🇸 **USA Expenses**  | Manage and view USA-related expenses                 |
| 📊 **Comparison** | Compare expense information between India and USA        |
| 💸 **Money Transfer** | Interface for money transfer-related information     |

---

## 🧩 Reusable Components

### SummaryCard

`SummaryCard.js` is a reusable React component used to display important summary information in a structured card format.

Reusable components help keep the application:

- Organized
- Maintainable
- Reusable
- Easy to update

---

## 📡 API Integration

The application can communicate with an external API to manage expense-related data.

The API can be used for operations such as:

- Fetching expense data
- Adding expenses
- Updating expenses
- Deleting expenses
- Managing expense information

The **Fetch API** is used to communicate between the React frontend and the backend/API.

---

## 🎯 Project Objectives

The main objectives of this project are:

- To build a practical React.js application
- To understand React component-based development
- To implement page navigation using React Router
- To work with API-based data
- To create reusable components
- To manage application state
- To create a responsive user interface
- To understand deployment using Netlify
- To develop a real-world expense management application

---

## 🔮 Future Improvements

Possible future improvements include:

- 👤 User registration
- 🔐 Secure backend authentication
- 💳 Online payment integration
- 📈 Advanced expense analytics
- 📊 Interactive charts and graphs
- 🔔 Expense reminders
- 📅 Monthly and yearly expense reports
- 💱 Real-time currency conversion
- 📥 Export expenses as PDF/Excel
- ☁️ Cloud-based user accounts
- 🌍 Support for additional countries
- 🔔 Budget limit notifications

---

## ⚠️ Disclaimer

**Global Expense Tracker** is an educational and portfolio project developed for learning and demonstration purposes.

Financial information displayed or managed through this application should **not** be considered financial advice.

---

## 👩‍💻 Developer

**Vidhya K**

- GitHub: [https://github.com/Vidhyak02](https://github.com/Vidhyak02)
- Repository: [https://github.com/Vidhyak02/Global-Expense-Tracker-](https://github.com/Vidhyak02/Global-Expense-Tracker-)
- Live Demo: [https://global-expense-tracker.netlify.app/](https://global-expense-tracker.netlify.app/)

---

## ⭐ Project

If you find this project useful or interesting, feel free to ⭐ **star the repository**.

---

**🌍 Global Expense Tracker**  
*Track Your Expenses. Compare Your Spending. Manage Your Money.*
```
