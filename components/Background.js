import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles";
export default function Background({ children }) {
  return (
    <LinearGradient
      colors={[colors.backgroundColor, colors.backgroundColor]}
      style={{
        flex: 1,
      }}
    >
      {children}
    </LinearGradient>
  );
}
