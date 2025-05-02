import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';

function Signup(){
	const [formData, setFormData] = useState({
		userName: '',
		password: '',
		email: '',
		phoneNumber: '',
		address: '',
	});

	const [error] = useState('');

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
		  ...prev,
		  [name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
		  !formData.userName ||
		  !formData.password ||
		  !formData.email ||
		  !formData.phoneNumber ||
		  !formData.address
		) {
		  return;
		}
	
		try {
		  const response = await fetch('https://localhost:7096/api/User', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  ...formData
			}),
		  });
	
		  if (response.ok) {
			setFormData({
			  userName: '',
			  password: '',
			  email: '',
			  phoneNumber: '',
			  address: '',
			});
			navigate('/');
		  } else {
			const errText = await response.text();
		  }
		} catch (err) {
		}
	  };

	return(
		<div className="position-absolute top-50 start-50 translate-middle">
				<h1>Signup</h1>
				<p></p>
		        <form onSubmit={handleSubmit}>
				{['userName', 'password', 'email', 'phoneNumber', 'address'].map((field) => (
		        	<>
					<div className="mb-3" key={field}>
							<label className="form-label">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
							<input type='text' className="form-control" name={field} value={(formData as any)[field]} onChange={handleChange} />
          			</div>
					</>
				))}
		            <button type="submit" className="btn btn-primary">Submit</button>
		        </form>
		</div>
	);
}

export default Signup;