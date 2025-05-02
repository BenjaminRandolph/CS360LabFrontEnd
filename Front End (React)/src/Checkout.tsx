import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CheckProps = {
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

function Checkout({ currentUser }: CheckProps){
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	const handleConfirmPurchase = async () => {
		const purchaserID = currentUser!.ID;
		const dateNow = new Date().toISOString();
	  
		try {
		  await Promise.all(
			cartItems.map(async (item) => {
			  const transaction = {
				id: 0,
				posterID: item.ownerID,
				productName: item.name,
				productDescription: item.description,
				amountPaid: item.price * item.quantity,
				amountOfProduct: item.quantity,
				category: "General",
				purchaserID: purchaserID,
				dateOfPurchase: dateNow,
				dateOfPosting: item.dateOfPosting,
			  };
	  
			  await fetch("https://localhost:7096/api/Transactions", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				body: JSON.stringify(transaction),
			  });
			})
		  );
		  navigate("/home?purchase=success");
		} catch (error) {
		  console.error("Error creating transaction:", error);
		}
	};

	const fetchCartItems = async () => {
		try {
		  const res = await fetch('https://localhost:7096/api/Carts/');
		  const cartData = await res.json();
	  
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
		fetchCartItems();
	  }, []);	  

	console.log('cartItems:', cartItems);

	const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
	const tax = Math.round(totalPrice * 0.05 * 100) / 100;
	const grandTotal = totalPrice + tax;


	return(
		<><br></br><section className="bg-light py-5">
				<div className="container">
					<div className="row">
						<div className="col-xl-8 col-lg-8 mb-4">
							<div className="card shadow-0 border">
								<div className="p-4">
									<h5 className="card-title mb-3">Checkout</h5>

									<hr className="my-4" />

									<h5 className="card-title mb-3">Shipping info</h5>

									<div className="row mb-3">
										<div className="col-lg-4 mb-3">
											<div className="form-check h-100 border rounded-3">
												<div className="p-3">
													<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
													<label className="form-check-label" htmlFor="flexRadioDefault1">
														Express delivery <br />
														<small className="text-muted">3-4 days via Fedex </small>
													</label>
												</div>
											</div>
										</div>
										<div className="col-lg-4 mb-3">
											<div className="form-check h-100 border rounded-3">
												<div className="p-3">
													<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
													<label className="form-check-label" htmlFor="flexRadioDefault2">
														Post office <br />
														<small className="text-muted">20-30 days via post </small>
													</label>
												</div>
											</div>
										</div>
										<div className="col-lg-4 mb-3">
											<div className="form-check h-100 border rounded-3">
												<div className="p-3">
													<input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
													<label className="form-check-label" htmlFor="flexRadioDefault3">
														Self pick-up <br />
														<small className="text-muted">Come to our shop </small>
													</label>
												</div>
											</div>
										</div>
									</div>

									<div className="mb-3">
										<p className="mb-0">Message to seller</p>
										<div className="form-outline">
											<textarea className="form-control" id="textAreaExample1" ></textarea>
										</div>
									</div>

									<div className="float-end">
										<button className="btn btn-light border">Cancel</button>
										<button onClick={handleConfirmPurchase} className="btn btn-success shadow-0 border">Confirm purchase</button>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-lg-4 d-flex justify-content-center justify-content-lg-end">
							<div className="ms-lg-4 mt-4 mt-lg-0">
								<h6 className="mb-3">Summary</h6>
								<div className="d-flex justify-content-between">
								  <p className="mb-2">Total price:</p>
								  <p className="mb-2">${totalPrice.toFixed(2)}</p>
								</div>
								<div className="d-flex justify-content-between">
								  <p className="mb-2">Tax (5%):</p>
								  <p className="mb-2">+ ${tax.toFixed(2)}</p>
								</div>
								<hr />
								<div className="d-flex justify-content-between">
								  <p className="mb-2">Total price:</p>
								  <p className="mb-2 fw-bold">${grandTotal.toFixed(2)}</p>
								</div>

								<hr />
								<h6 className="text-dark my-4">Items in cart</h6>
								{cartItems.length === 0 ? (
									<p className="text-muted">Your cart is empty.</p>
								) : (
									cartItems.map((item) => (
										<div className="d-flex align-items-center mb-4" key={item.id}>
											<div className="me-3 position-relative">
												<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-secondary">
													{item.quantity}
												</span>
											</div>
											<div>
												<a href="#" className="nav-link">
													{item.name}
												</a>
												<div className="price text-muted">Total: ${(item.price * item.quantity).toFixed(2)}</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</section></>
	);
}

export default Checkout;