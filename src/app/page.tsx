import { Navbar } from "./components/Navbar";
import { Transaction } from "./components/Transaction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Transaction />
    </main>
  );
}
