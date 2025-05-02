import { useState, useEffect } from "react";

type ListingsProps = {
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

function Listings({ currentUser }: ListingsProps){
	const [items, setItems] = useState<Item[]>([]);
	const userID = currentUser?.ID;

	useEffect(() => {
   	  const fetchListings = async () => {
     	try {
     		const response = await fetch("https://localhost:7096/api/ItemListings"); // Update URL as needed
     		if (!response.ok) throw new Error("Failed to fetch listings");

    	    const data = await response.json();
    	    setItems(data);
    	} catch (err) {
     		console.error("Error fetching item listings:", err);
     	}
   	 };

    	fetchListings();
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
	<>
		<header>
			<br></br>
			<br></br>
			<div className="p-3 text-center bg-white border-bottom">
				<div className="container">
					<div className="row gy-3">
						<div className="col-lg-5 col-md-12 col-12">
							<div className="input-group float-center position-absolute top-0 start-50">
								<div className="form-outline">
									<input type="search" id="form1" className="form-control" placeholder= "Search"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-primary mb-4">
				<div className="container py-4">
					<h3 className="text-white mt-2">Listings</h3>
				</div>
			</div>
		</header>
		<section className="">
		  <div className="container">
		    <div className="row">
		      <div className="col-lg-9">
		        <div className="row">
				{items.map((item) => (
				  <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 d-flex">
				    <div className="card w-100 my-2 shadow-2-strong">
				      <div className="card-body d-flex flex-column">
				        <h5 className="card-title">${item.price.toFixed(2)}</h5>
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

		        <hr />
		      </div>
		    </div>
		  </div>            
		</section>
	</>
	)
};

export default Listings;