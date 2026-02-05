import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "221771234567"; // Remplace par ton numéro

const PRODUCTS = [
  { id: 1, category: "books", name: "Bible Louis Segond", price: 8000, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", description: "Bible complète avec annotations et index." },
  { id: 2, category: "books", name: "Vie de Jésus", price: 6000, image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f", description: "Histoire et enseignements de Jésus." },
  { id: 3, category: "books", name: "Histoire de l'Église", price: 9000, image: "https://images.unsplash.com/photo-1591696331110-69a3c2d1d2f1", description: "Chronologie et événements clés de l'Église." },
  { id: 4, category: "objects", name: "Chapelet en bois", price: 2000, image: "https://images.unsplash.com/photo-1609592806955-df5a6c9c5b73", description: "Chapelet artisanal en bois naturel." },
  { id: 5, category: "objects", name: "Croix murale", price: 5000, image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30", description: "Croix décorative pour mur." },
  { id: 6, category: "objects", name: "Bougie votive", price: 1500, image: "https://images.unsplash.com/photo-1612197524534-4f99c13a238b", description: "Bougie pour prière ou méditation." },
];

function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("christin_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("christin_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeItem = (id) => setCart(cart.filter((i) => i.id !== id));

  const total = () => cart.reduce((t, i) => t + i.price * i.qty, 0);

  const whatsappLink = () => {
    let message = "Bonjour, je souhaite commander :%0A%0A";
    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name} (${item.qty}) - ${formatPrice(item.price * item.qty)}%0A`;
    });
    message += `%0ATotal : ${formatPrice(total())}%0A%0ANom : %0AAdresse :`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const ProductCard = ({ product }) => (
    <div
      onClick={() => { setSelectedProduct(product); setPage("product"); }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <img src={product.image} className="h-56 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-primary font-bold text-lg">{product.name}</h3>
        <p className="text-primary/80 mt-1">{formatPrice(product.price)}</p>
      </div>
    </div>
  );

  const CartFloatingButton = () => (
    cart.length > 0 ? (
      <div className="fixed bottom-6 right-6">
        <a
          href={whatsappLink()}
          target="_blank"
          className="bg-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-primary-hover transition-colors"
        >
          Commander via WhatsApp ({cart.length})
        </a>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header fixe */}
      <header className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <h1 className="text-3xl font-bold cursor-pointer" onClick={() => setPage("home")}>Christ IN</h1>
          <nav className="space-x-6 text-lg font-semibold">
            <button onClick={() => { setPage("home"); setSelectedProduct(null); }}>ACCUEIL</button>
            <button onClick={() => { setPage("books"); setSelectedProduct(null); }}>LIVRES</button>
            <button onClick={() => { setPage("objects"); setSelectedProduct(null); }}>OBJETS DE PIÉTÉ</button>
            <button onClick={() => { setPage("contact"); setSelectedProduct(null); }}>CONTACT</button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-32 p-6 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Page produit */}
        {page === "product" && selectedProduct && (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
            <img src={selectedProduct.image} className="w-full md:w-1/2 h-80 object-cover rounded-xl" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary">{selectedProduct.name}</h2>
              <p className="text-primary/80 mt-2">{selectedProduct.description}</p>
              <p className="text-primary font-bold text-xl mt-4">{formatPrice(selectedProduct.price)}</p>
              <button
                onClick={() => addToCart(selectedProduct)}
                className="mt-4 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        )}

        {/* Contact page */}
        {page === "contact" && (
          <div className="col-span-full bg-primary text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Contactez-nous</h2>
            <p>Email: contact@christin.com</p>
            <p>Téléphone: +221 77 123 45 67</p>
            <p>Adresse: Dakar, Sénégal</p>
          </div>
        )}

        {/* Liste produits */}
        {(page === "home" || page === "books" || page === "objects") &&
          (page === "home" ? PRODUCTS : PRODUCTS.filter(p => p.category === page)).map(p => (
            <ProductCard key={p.id} product={p} />
          ))
        }
      </main>

      {/* Footer */}
      <footer className="bg-footer text-white mt-12">
        <div className="max-w-7xl mx-auto p-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Christ IN</h3>
            <p>Christ IN est une boutique en ligne spécialisée dans les articles chrétiens : Bibles, objets de piété, chapelets, croix et bien plus. Notre objectif est de vous accompagner dans votre foi avec des produits de qualité et des services adaptés.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p>Email: contact@christin.com</p>
            <p>Téléphone: +221 77 123 45 67</p>
            <p>Adresse: Dakar, Sénégal</p>
          </div>
        </div>
        <div className="text-center bg-footer/80 p-4 mt-4">© 2026 Christ IN. Tous droits réservés.</div>
      </footer>

      <CartFloatingButton />
    </div>
  );
}
