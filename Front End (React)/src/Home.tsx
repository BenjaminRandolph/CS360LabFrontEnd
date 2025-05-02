import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type HomeProps = {
	currentUser: any;
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

function Home({ currentUser }: HomeProps){
	const [items, setItems] = useState<Item[]>([]);
	const userID = currentUser?.ID;
	const [searchParams, setSearchParams] = useSearchParams();
  	const [showBanner, setShowBanner] = useState(false);

  	useEffect(() => {
  	  if (searchParams.get("purchase") === "success") {
  	    setShowBanner(true);

  	    const timer = setTimeout(() => {
  	      setShowBanner(false);
  	      searchParams.delete("purchase");
  	      setSearchParams(searchParams);
  	    }, 3000);

  	    return () => clearTimeout(timer);
  	  }
  	}, [searchParams, setSearchParams]);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const res = await fetch("https://localhost:7096/api/ItemListings");
				if (!res.ok) throw new Error("Failed to fetch items");
				const data = await res.json();
	
				const sortedItems = data
					.sort((a: Item, b: Item) => new Date(b.dateOfPosting).getTime() - new Date(a.dateOfPosting).getTime())
					.slice(0, 4);
	
				setItems(sortedItems);
			} catch (err) {
				console.error("Error loading items:", err);
			}
		};
		fetchItems();
	}, []);
	
	  
	  const addToCart = async (listingID: number) => {
		try {
		  const response = await fetch('https://localhost:7096/api/Carts', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  id: 0,
			  userID: userID,
			  listingID: listingID,
			}),
		  });
		} catch (error) {
		  console.error(error);
		}
		if (!currentUser?.ID) {
			console.error("User ID is missing.");
			console.log("Adding to cart. Current user:", currentUser);
			return;
		}
		console.log("User ID:", userID);
		console.log("Adding item to cart:", listingID);
	  };

	return(
		<><header>
			<br></br>
			<br></br>
			<br></br>
			<nav className="navbar navbar-expand-lg navbar-light bg-white">
			</nav>
			<div className="container">
    		  {showBanner && (
    		    <div className="alert alert-success text-center" role="alert">
    		      Purchase Successful!
    		    </div>
    		  )}
    		</div>
			<div className="bg-primary text-white py-5">
				<div className="container py-5">
					<h1>
						The website YOU NEED!!11!! <br />
						:)
					</h1>
					<p>
						Please buy our stuff thx
					</p>
				</div>
			</div>
		 </header><section>
				<div className="container my-5">
					<header className="mb-4">
						<h3>New products</h3>
					</header>

					<div className="row">
					{items.map((item) => (
							<div key={item.id} className="col-lg-3 col-md-6 col-sm-6 d-flex">
								<div className="card w-100 my-2 shadow-2-strong">
									<div className="card-body d-flex flex-column">
										<h5 className="card-title">{item.name}</h5>
										<p className="card-text">${item.price.toFixed(2)}</p>
										<p className="card-text">{item.description}</p>
										<div className="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
											<button
												className="btn btn-primary shadow-0 me-1"
												onClick={() => addToCart(item.id)}
											>
												Add to cart
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section></>
	)
}	

export default Home;