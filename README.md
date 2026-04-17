# Floosi - فلوسي 💰

Floosi is a modern, light-weight personal finance management application built with **React Native** and **Expo**. It empowers users to track their daily transactions, visualize their spending habits, and manage their budget with ease, all while supporting full RTL (Arabic) and LTR (English) layouts.

---

## 🌟 Features

### 🌍 Multi-language Support
- Full support for **Arabic** and **English**.
- Clean, automatic RTL (Right-to-Left) layout for Arabic users.
- Persistent language settings.

### 📊 Financial Insights
- **Interactive Dashboard**: Quick view of your total balance, income, and expenses.
- **Dynamic Charts**: Visualize your spending trends and category-wise breakdown using `react-native-chart-kit`.
- **Flexible Filters**: View reports for Today, Week, Month, or custom date ranges.

### 💸 Transaction Management
- Categorized transactions (Food, Salary, Transport, etc.).
- Add notes and dates to keep track of details.
- Real-time updates to your balance.

### 🌑 Modern UI/UX
- **Dark Mode Support**: Sleek, eye-friendly dark theme.
- **Responsive Design**: Optimized for various screen sizes.
- **Premium Aesthetics**: Smooth animations and curated color palettes.

### 🔒 Privacy & Data
- **Local Storage**: All your data is stored securely on your device (SQLite/AsyncStorage). We never send your data to the cloud.
- **Export Data**: Export your financial records as JSON for backups.

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mostafa-abd/floosi.git
   cd floosi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

---

## 📱 Build & Deployment

### Android
To generate a production-ready APK for Android:
```bash
npx eas build --profile preview --platform android
```

### iOS (Simulator)
To generate a build for the iOS Simulator:
```bash
npx eas build --profile simulator --platform ios
```

---

## 🛠 Tech Stack
- **Framework**: React Native with Expo SDK 54.
- **State Management**: Zustand.
- **Navigation**: React Navigation (Stack & Tab).
- **Icons**: Lucide React Native.
- **Charts**: React Native Chart Kit.
- **Localization**: i18next.

---

## 👤 Author
**Mostafa** - [GitHub Profile](https://github.com/mostafa-abd)

---

## 📄 License
This project is licensed under the MIT License.
