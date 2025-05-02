import { useEffect, useState } from "react";

type User = {
  ID: number;
  UserName: string;
  Email: string;
  Address: string;
  PhoneNumber: string;
  Funds: number;
};

type AccountProps = {
	currentUser: User | null;
};

type Transaction = {
	id: number;
	posterID: number;
	productName: string;
	productDescription: string;
	amountPaid: number;
	amountOfProduct: number;
	category: string;
	purchaserID: number;
	dateOfPurchase: string;
	dateOfPosting: string;
  };  

function Account({ currentUser }: AccountProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const userID = currentUser!.ID;

  useEffect(() => {  
	const fetchUserInfo = async () => {
	  try {
		const res = await fetch(`https://cs360labbackend.railway.internal:7096/api/User/${userID}`);
		const data = await res.json();
		console.log("Fetched user data:", data);
		setUser(data);
	  } catch (error) {
		console.error("Error fetching user info:", error);
	  }
	};
  
	fetchUserInfo();
  }, [currentUser]);

  useEffect(() => {
	const fetchTransactions = async () => {
	  try {
		const res = await fetch(`https://cs360labbackend.railway.internal:7096/api/Transactions`);
		const data: Transaction[] = await res.json();
  
		const userTransactions = data.filter(tx => tx.purchaserID === currentUser!.ID);
		setTransactions(userTransactions);
	  } catch (error) {
		console.error("Error fetching transactions:", error);
	  }
	};
  
	fetchTransactions();
  }, [currentUser!.ID]);
  
	
	return(
		<>
			<div>
			<br></br>
			<br></br>
			<div className="container py-5">
				<div>
					<h1>Account</h1>
				</div>
				<br></br>
				<div className="container">
          		  <h5>Name:</h5>
          		  <p>{user?.UserName || "Failed to load"}</p>

				  <h5>Phone number:</h5>
          		  <p>{user?.PhoneNumber || "Failed to load"}</p>

				  <h5>Address:</h5>
          		  <p>{user?.Address || "Failed to load"}</p>

				  <h5>Email:</h5>
          		  <p>{user?.Email || "Failed to load"}</p>
			
          		  <h5>Balance:</h5>
          		  <p>{user?.Funds || 0}</p>
          		</div>
			</div>
		  <div className="container">
		    <div className="row">
		      <div className="col-lg-9">
				
			  <div>
				  <h5>Purchase History</h5>
				  {transactions.length === 0 ? (
				    <p className="text-muted">You haven't made any purchases yet.</p>
				  ) : (
				    <div className="row">
				      {transactions.map(tx => (
				        <div className="col-md-6 col-lg-4 mb-4" key={tx.id}>
				          <div className="card h-100 shadow-sm">
				            <div className="card-body">
				              <h5 className="card-title">{tx.productName}</h5>
				              <p className="card-text">{tx.productDescription}</p>
				              <p className="card-text"><strong>Price Paid:</strong> ${tx.amountPaid.toFixed(2)}</p>
				              <p className="card-text"><strong>Quantity:</strong> {tx.amountOfProduct}</p>
				              <p className="card-text"><strong>Category:</strong> {tx.category}</p>
				              <p className="card-text">
				                <small className="text-muted">
				                  Purchased on: {new Date(tx.dateOfPurchase).toLocaleDateString()}
				                </small>
				              </p>
				            </div>
				          </div>
				        </div>
				      ))}
				    </div>
				  )}
				</div>

		      </div>
		    </div>
			</div>
		  </div>
		</>
	);
}

export default Account;