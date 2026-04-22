export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto text-sm md:text-base">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} OdontoPro. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
