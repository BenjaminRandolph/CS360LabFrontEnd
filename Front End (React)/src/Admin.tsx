import { useEffect, useState } from "react";

type User = {
  id: number;
  UserName: string;
  email: string;
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

function Admin({ currentUser }: AccountProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
	const fetchUsers = async () => {
	  try {
		const res = await fetch(`https://bensfunnyapi.up.railway.app:7096/api/User`);
		const data: User[] = await res.json();
		setUsers(data);
	  } catch (error) {
		console.error("Error fetching user list:", error);
	  }
	};
  
	fetchUsers();
  }, []);
  
	
	return(
		<>
			<div>
			<div className="container py-5">
				<div>
					<h1>Admin Dashboard</h1>
				</div>
			</div>
		  <div className="container">
		    <div className="row">
		      <div className="col-lg-9">
				
			  <div>
			  <h5>User Accounts</h5>
				   {users.length === 0 ? (
				     <p className="text-muted">No user accounts have been made yet.</p>
				   ) : (
				     <div className="row">
				       {users.map(u => (
				         <div className="col-md-6 col-lg-4 mb-4" key={u.id}>
				           <div className="card h-100 shadow-sm">
				             <div className="card-body">
				               <h5 className="card-title">{u.UserName}</h5>
				               <p className="card-text"><strong>User name:</strong> {u.email}</p>
				               <p className="card-text"><strong>User ID:</strong> {u.id}</p>
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

export default Admin;