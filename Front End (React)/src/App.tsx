import { LinkContainer } from 'react-router-bootstrap'
import { Nav } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Signup from './Signup'
import Account from './Account'
import Listings from './Listings'
import Home from './Home'
import Checkout from './Checkout'
import Cart from './Cart'
import Admin from './Admin'
import React, { useEffect, useState } from 'react';

function App(){
	const [users, setUsers] = useState<any>(null);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [username, setUsername] = useState('');
	const [userpass, setUserpass] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		fetch('https://localhost:7096/api/User')
		  .then(res => {
			if (!res.ok) {
			  throw new Error(`HTTP error! Status: ${res.status}`);
			}
			return res.json();
		  })
		  .then(data => setUsers(data))
		  .catch(error => {
			console.error('Error fetching users:', error);
		  });
	}, []);
	  
	const handleSubmit = (e: React.FormEvent) => {
    	e.preventDefault();

    	fetch('https://localhost:7096/api/User/LoginUser/' + username + '/' + userpass)
  			.then(res => {
  			  if (!res.ok) {
  			    throw new Error('Login failed');
  			  }
  			  return res.text();
  			})
  			.then(userID => {
				console.log("Raw userId response:", userID);
				const parsedId = parseInt(userID.replace(/[^0-9]/g, ''));
				if (isNaN(parsedId)) {
				  console.error("Could not parse userId:", userID);
				  return;
				}
				setCurrentUser({ ID: parsedId, username });
				navigate("/home");
			  })							
  			.catch(error => {
  			  console.error('Login error', error);
  			});
  	};
	
	return(
		<div>			
    		<nav className="navbar navbar-expand-lg bg-body-tertiary position-absolute top-0 start-0">
				<div className="container-fluid">
					<nav>
        				<Link to="/home" className='navbar-brand'>BDB</Link>
      				</nav>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
				 	</button>
				  	<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<nav>
        						<Link to="/signup" className='nav-link'>Signup</Link>
      							</nav>
					  		</li>
							  <li className="nav-item">
								<nav>
        						<Link to="/#" className='nav-link'>Login</Link>
      							</nav>
					  		</li>
							<li className="nav-item">
								<nav>
        						<Link to="/account" className='nav-link'>Account</Link>
      							</nav>
					  		</li>
							<li className="nav-item">
								<nav>
        						<Link to="/listings" className='nav-link'>Listings</Link>
      							</nav>
					  		</li>
							<li className="nav-item">
								<nav>
        						<Link to="/cart" className='nav-link'>Cart</Link>
      							</nav>
					  		</li>
							{/*{currentUser?.adminPermission && (*/}
    						<li className="nav-item">
    						    <nav>
    						    <Link to="/admin" className="nav-link">Admin</Link>
    						    </nav>
    						</li>
    						{/*})}*/}
						</ul>
				  	</div>
				</div>
	 		</nav>

			<Routes>
				<Route path="/" element={
        			<div className="position-absolute top-50 start-50 translate-middle">
						<h1>Login</h1>
						<p></p>
        			    <form onSubmit={handleSubmit}>
        			      <div className="mb-3">
        			        <label className="form-label">Username</label>
        			        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
        			      </div>
        			      <div className="mb-3">
        			        <label className="form-label">Password</label>
        			        <input type="text" className="form-control" value={userpass} onChange={(e) => setUserpass(e.target.value)}/>
        			      </div>
        			      <button type="submit" className="btn btn-primary">Submit</button>
        			    </form>
        			  </div>
        			} />
        		<Route path="/signup" element={<Signup />} />
				<Route path="/account" element={<Account currentUser={currentUser}/>} />
				<Route path="/listings" element={<Listings currentUser={currentUser} />} />
				<Route path="/home" element={<Home currentUser={currentUser}/>} />
				<Route path="/checkout" element={<Checkout currentUser={currentUser}/>} />
				<Route path="/cart" element={<Cart currentUser={currentUser} />} />
				<Route path="/admin" element={<Admin currentUser={currentUser}/>} />

      		</Routes>
	  </div>
	);
}

export default App;
