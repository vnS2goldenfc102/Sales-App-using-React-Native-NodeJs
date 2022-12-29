import Routes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "./states/store";
import { SafeAreaProvider } from "react-native-safe-area-context"
export default function App() {
  console.reportErrorsAsExceptions = false;
  return (
    
      <Provider store={store}>
        <Routes />
      </Provider>
   

  );
}
