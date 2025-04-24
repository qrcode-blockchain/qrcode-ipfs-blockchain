// "use client"
// import { useState } from 'react';
// import { Calendar, Hash, Package, MapPin, DollarSign, Barcode, Scale, User, Database, FileText, Check } from 'lucide-react';

// export default function ProductForm() {
//   const [formData, setFormData] = useState({
//     productName: '',
//     batchNumber: '',
//     location: '',
//     date: new Date().toISOString().split('T')[0],
//     price: '',
//     serialNumber: '',
//     weight: '',
//     manufacturerName: ''
//   });

//   const [response, setResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [ipfsHash, setIpfsHash] = useState(null);
//   const [txnHash, setTxnHash] = useState(null)

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
  
//     try {

//       // Step 2: Store data on IPFS
//       const ipfsResponse = await fetch('/api/ipfs_store', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//         }),
//       });
      
//       if (!ipfsResponse.ok) {
//         throw new Error('Failed to store data on IPFS');
//       }
      
//       const ipfsData = await ipfsResponse.json();
//       setIpfsHash(ipfsData.ipfsHash);


//       // Step 1: Generate QR code and hash
//       const response = await fetch('/api/qr_generation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           ipfsHash: ipfsData.ipfsHash,
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to process product data');
//       }
  
//       const data = await response.json();
//       setResponse(data);
      
      
//       // Step 3: Store IPFS hash on chain - use the hash from the response directly
//       // instead of from state
//       const chainResponse = await fetch('/api/chain_store', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ipfsHash: ipfsData.ipfsHash }), // Use directly from response
//       });
      
//       if (!chainResponse.ok) {
//         throw new Error('Failed to store hash on chain');
//       }
      
//       const chainData = await chainResponse.json();
//       console.log('chain Tx:', chainData.txHash);
//       setTxnHash(chainData.txHash)
      
//     } catch (err) {
//       setError(err.message);
//       console.error("Error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-extrabold text-gray-900">Product Registration System</h1>
//           <p className="mt-2 text-lg text-gray-600">Enter product details to generate tracking information</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-6 py-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Information</h2>
//               <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
//                   <div className="sm:col-span-2">
//                     <label htmlFor="productName" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <Package className="h-4 w-4 mr-2" />
//                       Product Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="productName"
//                         id="productName"
//                         required
//                         value={formData.productName}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="batchNumber" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <Hash className="h-4 w-4 mr-2" />
//                       Batch Number
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="batchNumber"
//                         id="batchNumber"
//                         required
//                         value={formData.batchNumber}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="location" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       Location
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="location"
//                         id="location"
//                         required
//                         value={formData.location}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="date" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       Date
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="date"
//                         name="date"
//                         id="date"
//                         required
//                         value={formData.date}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="price" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <DollarSign className="h-4 w-4 mr-2" />
//                       Price
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="number"
//                         name="price"
//                         id="price"
//                         step="0.01"
//                         required
//                         value={formData.price}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="serialNumber" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <Barcode className="h-4 w-4 mr-2" />
//                       Serial Number
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="serialNumber"
//                         id="serialNumber"
//                         required
//                         value={formData.serialNumber}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="weight" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <Scale className="h-4 w-4 mr-2" />
//                       Weight
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="weight"
//                         id="weight"
//                         required
//                         value={formData.weight}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="manufacturerName" className=" text-sm font-medium text-gray-700 flex items-center">
//                       <User className="h-4 w-4 mr-2" />
//                       Manufacturer Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         type="text"
//                         name="manufacturerName"
//                         id="manufacturerName"
//                         required
//                         value={formData.manufacturerName}
//                         onChange={handleChange}
//                         className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
//                   >
//                     {isLoading ? 'Processing...' : 'Generate Product Data'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Output Section */}
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-6 py-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Generated Information</h2>
              
//               {!response && !error && (
//                 <div className="flex flex-col items-center justify-center h-full py-16">
//                   <div className="bg-gray-100 rounded-full p-6">
//                     <Barcode className="h-12 w-12 text-gray-400" />
//                   </div>
//                   <p className="mt-6 text-gray-500 text-center">Fill out the form and submit to generate product tracking information</p>
//                 </div>
//               )}

//               {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-md p-4">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">Error</h3>
//                       <div className="mt-2 text-sm text-red-700">{error}</div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {response && (
//                 <div className="space-y-6">
//                   {/* QR Code */}
//                   <div className="flex flex-col items-center justify-center mb-6">
//                     <div className="bg-white p-4 border border-gray-200 rounded-lg">
//                       <img src={response.qrCode} alt="Product QR Code" className="h-40 w-40" />
//                     </div>
//                     <p className="mt-2 text-sm text-gray-500">Scan to verify product authenticity</p>
//                   </div>
                  
//                   {/* Product Details */}
//                   <div className="space-y-4">
//                     <div className="bg-gray-50 rounded-md p-3">
//                       <p className="text-xs font-medium text-gray-500">PRODUCT</p>
//                       <p className="font-medium text-gray-900">{formData.productName}</p>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-md p-3">
//                       <p className="text-xs font-medium text-gray-500">TRACKING URL</p>
//                       <a 
//                         href={response.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer" 
//                         className="text-indigo-600 hover:text-indigo-500 font-medium text-sm break-all"
//                       >
//                         {response.url}
//                       </a>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-md p-3">
//                       <p className="text-xs font-medium text-gray-500">HASH</p>
//                       <p className="font-mono text-xs text-gray-900 break-all">{response.hash}</p>
//                     </div>
                    
//                     {ipfsHash && (
//                       <div className="bg-gray-50 rounded-md p-3">
//                         <p className="text-xs font-medium text-gray-500">IPFS HASH</p>
//                         <p className="font-mono text-xs text-gray-900 break-all">{ipfsHash}</p>
//                         <a 
//                           href={`https://ipfs.io/ipfs/${ipfsHash}`}
//                           target="_blank" 
//                           rel="noopener noreferrer" 
//                           className="text-indigo-600 hover:text-indigo-500 font-medium text-xs mt-1 inline-"
//                         >
//                           View on IPFS
//                         </a>
//                       </div>
//                     )}
//                   </div>
                    
//                     <div className="bg-gray-50 rounded-md p-3">
//                       <p className="text-xs font-medium text-gray-500">Bloakchain Transaction HASH</p>
//                       <p className="font-mono text-xs text-gray-900 break-all">{txnHash}</p>
//                     </div>
                  
//                   <div className="border-t border-gray-200 pt-4 mt-4">
//                     <button 
//                       onClick={() => window.print()} 
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                       <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                       </svg>
//                       Print
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"
import { useState } from 'react';
import { Calendar, Hash, Package, MapPin, DollarSign, Barcode, Scale, User, Database, FileText, Check, Copy, Printer, ExternalLink, AlertCircle } from 'lucide-react';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    productName: '',
    batchNumber: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    price: '',
    serialNumber: '',
    weight: '',
    manufacturerName: ''
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [txnHash, setTxnHash] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      // Step 2: Store data on IPFS
      const ipfsResponse = await fetch('/api/ipfs_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      
      if (!ipfsResponse.ok) {
        throw new Error('Failed to store data on IPFS');
      }
      
      const ipfsData = await ipfsResponse.json();
      setIpfsHash(ipfsData.ipfsHash);

      // Step 1: Generate QR code and hash
      const response = await fetch('/api/qr_generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ipfsHash: ipfsData.ipfsHash,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process product data');
      }
  
      const data = await response.json();
      setResponse(data);
      
      // Step 3: Store IPFS hash on chain
      const chainResponse = await fetch('/api/blockchain_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ipfsHash: ipfsData.ipfsHash }),
      });
      
      if (!chainResponse.ok) {
        throw new Error('Failed to store hash on chain');
      }
      
      const chainData = await chainResponse.json();
      console.log('chain Tx:', chainData.txHash);
      setTxnHash(chainData.txHash);
      
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Product Registration System</h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">Enter product details to generate secure tracking information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-indigo-800 flex items-center">
                <Package className="h-5 w-5 mr-2 text-indigo-600" />
                Product Information
              </h2>
            </div>
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="productName" className=" text-sm font-medium text-gray-700 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-indigo-500" />
                      Product Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="productName"
                        id="productName"
                        required
                        value={formData.productName}
                        onChange={handleChange}
                        className=" w-full pr-10 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="batchNumber" className=" text-sm font-medium text-gray-700 flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-indigo-500" />
                      Batch Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="batchNumber"
                        id="batchNumber"
                        required
                        value={formData.batchNumber}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="BAT-000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className=" text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                      Location
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="Manufacturing location"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className=" text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                      Production Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price" className=" text-sm font-medium text-gray-700 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className=" w-full pl-7 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serialNumber" className=" text-sm font-medium text-gray-700 flex items-center">
                      <Barcode className="h-4 w-4 mr-2 text-indigo-500" />
                      Serial Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="serialNumber"
                        id="serialNumber"
                        required
                        value={formData.serialNumber}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="SN-12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="weight" className=" text-sm font-medium text-gray-700 flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-indigo-500" />
                      Weight
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="weight"
                        id="weight"
                        required
                        value={formData.weight}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="e.g. 5kg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="manufacturerName" className=" text-sm font-medium text-gray-700 flex items-center">
                      <User className="h-4 w-4 mr-2 text-indigo-500" />
                      Manufacturer
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="manufacturerName"
                        id="manufacturerName"
                        required
                        value={formData.manufacturerName}
                        onChange={handleChange}
                        className=" w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-lg p-3 border text-black"
                        placeholder="Manufacturer name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-2" />
                        Generate Product Data
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-indigo-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Generated Information
              </h2>
            </div>
            <div className="px-6 py-6">
              {!response && !error && (
                <div className="flex flex-col items-center justify-center h-64 py-8">
                  <div className="bg-gray-50 rounded-full p-6 shadow-md">
                    <Barcode className="h-12 w-12 text-indigo-300" />
                  </div>
                  <p className="mt-6 text-gray-500 text-center font-medium">Fill out the form and submit to generate product tracking information</p>
                  <p className="mt-2 text-gray-400 text-sm text-center max-w-md">Product data will be securely stored and a unique QR code will be generated</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Processing Request</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {response && (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center mb-8 bg-gray-50 py-6 rounded-lg border border-gray-100">
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                      <img src={response.qrCode} alt="Product QR Code" className="h-48 w-48" />
                    </div>
                    <p className="mt-4 text-sm text-gray-600 flex items-center">
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      Scan to verify product authenticity
                    </p>
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</p>
                      <p className="font-medium text-gray-900 text-lg">{formData.productName}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">TRACKING URL</p>
                      <a 
                        href={response.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-500 font-medium text-sm break-all flex items-center"
                      >
                        {response.url}
                        <ExternalLink className="h-3 w-3 ml-1 inline" />
                      </a>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">VERIFICATION HASH</p>
                      <div className="flex items-center">
                        <p className="font-mono text-xs text-gray-800 break-all">{response.hash}</p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(response.hash)}
                          className="ml-2 text-gray-400 hover:text-indigo-600"
                          title="Copy hash"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {ipfsHash && (
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">IPFS HASH</p>
                        <div className="flex items-center">
                          <p className="font-mono text-xs text-gray-800 break-all">{ipfsHash}</p>
                          <button 
                            onClick={() => navigator.clipboard.writeText(ipfsHash)}
                            className="ml-2 text-gray-400 hover:text-indigo-600"
                            title="Copy IPFS hash"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <a 
                          href={`https://ipfs.io/ipfs/${ipfsHash}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-500 font-medium text-xs mt-2 inline-flex items-center"
                        >
                          View on IPFS
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">CHAIN TRANSACTION HASH</p>
                      <div className="flex items-center">
                        <p className="font-mono text-xs text-gray-800 break-all">{txnHash}</p>
                        <button 
                          onClick={() => navigator.clipboard.writeText(txnHash)}
                          className="ml-2 text-gray-400 hover:text-indigo-600"
                          title="Copy transaction hash"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-200 pt-5 mt-6">
                    <button 
                      onClick={() => window.print()} 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      <Printer className="h-4 w-4 mr-2 text-gray-500" />
                      Print Details
                    </button>
                    
                    <button 
                      onClick={() => navigator.clipboard.writeText(JSON.stringify({
                        product: formData.productName,
                        hash: response.hash,
                        ipfsHash: ipfsHash,
                        transactionHash: txnHash
                      }, null, 2))}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      <Copy className="h-4 w-4 mr-2 text-gray-500" />
                      Copy Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}