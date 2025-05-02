import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type CartProps = {
	currentUser: any;
};

type CartItem = {
	cartID: number;
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
};

type Item = {
	id: number;
	ownerID: number;
	name: string;
	description: string;
	price: number;
	category: string;
	dateOfPosting: string;
};

function Cart({ currentUser }: CartProps){
	const userId = currentUser?.ID;
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [recommended, setRecommended] = useState<Item[]>([]);
	
	const updateQuantity = (id: number, quantity: number) => {
		setCartItems(prev =>
			prev.map(item => item.id === id ? { ...item, quantity } : item)
		);
	};
	  
	
	const removeItem = async (cartId: number) => {
		try {
		  const res = await fetch('https://localhost:7096/api/Carts/' + cartId, {
			method: 'DELETE',
		  });
	  
		  if (!res.ok) throw new Error("Failed to delete item from backend");
	  
		  setCartItems(prev => prev.filter(item => item.cartID !== cartId));
		  fetchCartItems();
		} catch (error) {
		  console.error("Error deleting cart item:", error);
		}
	};
	  
	
	const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
	const tax = Math.round(totalPrice * 0.05 * 100) / 100;
	const grandTotal = totalPrice + tax;
	const addToCart = async (listingID: number) => {
		try {
		  const response = await fetch('https://localhost:7096/api/Carts', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  id: 0,
			  userID: currentUser?.ID,
			  listingID: listingID,
			}),
		  });
		  fetchCartItems();
		} catch (error) {
		  console.error(error);
		}
		if (!currentUser?.ID) {
			console.error("User ID is missing.");
			console.log("Adding to cart. Current user:", currentUser);
			return;
		  }
	  };

		const fetchCartItems = async () => {
		  try {
			const res = await fetch('https://localhost:7096/api/Carts/');
			const cartData = await res.json();
	  
			console.log("Fetched cart data:", cartData);
	  
			const enrichedItems: CartItem[] = await Promise.all(
			  cartData.map(async (cartItem: { id: number; listingID: number }) => {
				const listingRes = await fetch('https://localhost:7096/api/ItemListings/' + cartItem.listingID);
				const itemData = await listingRes.json();
	  
				return {
				  id: cartItem.id,
				  name: itemData.name,
				  description: itemData.description,
				  price: itemData.price,
				  quantity: 1,
				};
			  })
			);
	  
			setCartItems(enrichedItems);
		  } catch (error) {
			console.error("Error fetching cart items:", error);
		  }
		};

	  useEffect(() => {
		if (userId) {
		  fetchCartItems();
		  console.log("Fetching cart items for userId:", userId);
		  console.log("Current user object:", currentUser);
		  console.log("Cart items in state:", cartItems);
		}
	  }, [userId]);

	  useEffect(() => {
		const fetchRecommended = async () => {
		  try {
			const response = await fetch("https://localhost:7096/api/ItemListings");
			if (!response.ok) throw new Error("Failed to fetch products");
	  
			const data = await response.json();
			
			const shuffled = [...data].sort(() => 0.5 - Math.random());
			const selected = shuffled.slice(0, 4);
	  
			setRecommended(selected);
		  } catch (error) {
			console.error("Error fetching recommended items:", error);
		  }
		};
	  
		fetchRecommended();
	  }, []);	  
	
	return(
		<>
	  <section className="bg-light my-5">
  		<div className="container">
  		  <div className="row">
  		    <div className="col-lg-9">
  		      <div className="card border shadow-0">
  		        <div className="m-4">
  		          <h4 className="card-title mb-4">Cart</h4>
  		          {cartItems.map(item => (
  		            <div className="row gy-3 mb-4" key={item.id}>
  		              <div className="col-lg-5">
  		                <div className="me-lg-5">
  		                  <div className="d-flex">
  		                    <div>
  		                      <span className="nav-link">{item.name}</span>
  		                      <p className="text-muted">{item.description}</p>
  		                    </div>
  		                  </div>
  		                </div>
  		              </div>
  		              <div className="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
  		                <div>
  		                  	<select className="form-select me-4" value={item.quantity} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateQuantity(item.id, parseInt(e.target.value))}>
  		                    	{[1, 2, 3, 4].map(q => (<option key={q}>{q}</option>))}
  		                  	</select>
  		                </div>
  		                <div>
  		                  <p className="h6">${(item.price * item.quantity).toFixed(2)}</p>
  		                  <small className="text-muted"> ${item.price.toFixed(2)} / per item </small>
  		                </div>
  		              </div>
  		              <div className="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
  		                <div className="float-md-end">
  		                  <button onClick={() => removeItem(item.id)} className="btn btn-light border text-danger">
  		                    Remove
  		                  </button>
  		                </div>
  		              </div>
  		            </div>
  		          ))}
  		        </div>
  		      </div>
  		    </div>

  		    <div className="col-lg-3">
  		      <div className="card shadow-0 border">
  		        <div className="card-body">
  		          <div className="d-flex justify-content-between">
  		            <p className="mb-2">Total price:</p>
  		            <p className="mb-2">${totalPrice.toFixed(2)}</p>
  		          </div>
  		          <div className="d-flex justify-content-between">
  		            <p className="mb-2">TAX:</p>
  		            <p className="mb-2">${tax.toFixed(2)}</p>
  		          </div>
  		          <hr />
  		          <div className="d-flex justify-content-between">
  		            <p className="mb-2">Total price:</p>
  		            <p className="mb-2 fw-bold">${grandTotal.toFixed(2)}</p>
  		          </div>
			  
  		          <div className="mt-3">
  		            <Link to="/checkout" className="btn btn-success w-100 shadow-0 mb-2">Checkout</Link>
  		            <Link to="/listings" className="btn btn-light w-100 border mt-2">Back to shop</Link>
  		          </div>
  		        </div>
  		      </div>
  		    </div>
  		  </div>
  		</div>
	  </section>
	  <section>
		<div className="container my-5">
		  <header className="mb-4">
			<h3>Recommended items</h3>
		  </header>
	  
		  <div className="row">
		  {recommended.map((item) => (
			  <div className="col-lg-3 col-md-6 col-sm-6" key={item.id}>
			    <div className="card px-4 border shadow-0 mb-4 mb-lg-0">
			      <div className="card-body d-flex flex-column pt-3 border-top">
			        <span className="nav-link">{item.name}</span>
			        <p className="text-muted">{item.description}</p>
			        <div className="price-wrap mb-2">
			          <strong>${item.price.toFixed(2)}</strong>
			        </div>
			        <div className="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
			          <button onClick={() => addToCart(item.id)} className="btn btn-outline-primary w-100">
			            Add to cart
			          </button>
			        </div>
			      </div>
			    </div>
			  </div>
			))}
		  </div>
		</div>
	  </section>
	  </>
	);
}

export default Cart;