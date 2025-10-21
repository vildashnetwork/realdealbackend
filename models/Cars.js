import mongoose from "mongoose"

const CarSchema = new mongoose.Schema(
    {
        ProductName: { type: String, required: true },
        SKU: { type: String, required: true },
        Description: { type: String, required: true },
        Specifications: { type: String, required: true },
        Price: { type: String, required: true },
        CompareatPrice: { type: String, default: "" },
        Weight: { type: String, required: true },
        Category: { type: String, required: true },
        StockQuantity: { type: String, required: true },
        img3: { type: String, required: true },
        img2: { type: String, defualt: "" },
        img4: { type: String, default: "" },
        img5: { type: String, default: "" },
        img6: { type: String, default: "" },
    },
    { timestamps: true }
);


const FishingTool = mongoose.model("FishingTool", CarSchema)

export default FishingTool





























// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import AdminLayout from "@/components/admin/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ArrowLeft, Upload } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";

// const ProductForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = !!id;

//   const [formData, setFormData] = useState({
//     ProductName: "",
//     SKU: "",
//     Description: "",
//     Specifications: "",
//     Price: "",
//     CompareatPrice: "",
//     Weight: "",
//     Category: "",
//     StockQuantity: "",
//     img3: "",
//   });

//   const [categories, setCategories] = useState<string[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Load categories and product if editing
//   useEffect(() => {
//     setCategories(["Rods", "Reels", "Hooks", "Lures", "Lines", "Accessories"]);

//     if (isEdit) {
//       const fetchProduct = async () => {
//         try {
//           setLoading(true);
//           const res = await axios.get(`https://realdealbackend.onrender.com/add/${id}`);
//           if (res.status === 200 && res.data.fishingTool) {
//             const p = res.data.fishingTool;
//             setFormData({
//               ProductName: p.ProductName || "",
//               SKU: p.SKU || "",
//               Description: p.Description || "",
//               Specifications: p.Specifications || "",
//               Price: p.Price?.toString() || "",
//               CompareatPrice: p.CompareatPrice?.toString() || "",
//               Weight: p.Weight?.toString() || "",
//               Category: p.Category || "",
//               StockQuantity: p.StockQuantity?.toString() || "",
//               img3: p.img3 || "",
//             });
//           } else {
//             toast.error("Product not found");
//             navigate("/admin/products");
//           }
//         } catch (err) {
//           console.error(err);
//           toast.error("Failed to load product");
//           navigate("/admin/products");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProduct();
//     }
//   }, [id, isEdit, navigate]);

//   // 🔹 Upload Image to Cloudinary
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     const cloudForm = new FormData();
//     cloudForm.append("file", file);
//     cloudForm.append("upload_preset", "images-zozac");

//     try {
//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/dbq5gkepx/image/upload",
//         cloudForm
//       );
//       setFormData((prev) => ({ ...prev, img3: res.data.secure_url }));
//       toast.success("Image uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 🔹 Submit Form (Add or Update)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         ProductName: formData.ProductName,
//         SKU: formData.SKU,
//         Description: formData.Description,
//         Specifications: formData.Specifications,
//         Price: parseFloat(formData.Price),
//         CompareatPrice: parseFloat(formData.CompareatPrice) || 50.00,
//         Weight: parseFloat(formData.Weight),
//         Category: formData.Category,
//         StockQuantity: parseInt(formData.StockQuantity),
//         img3: formData.img3,
//       };

//       if (isEdit) {
//         const res = await axios.put(`https://realdealbackend.onrender.com/add/${id}`, payload);
//         if (res.status === 200) {
//           toast.success("Product updated successfully!");
//           navigate("/admin/products");
//         }
//       } else {
//         const res = await axios.post("https://realdealbackend.onrender.com/add", payload);
//         if (res.status === 201) {
//           toast.success("Product added successfully!");
//           navigate("/admin/products");
//         }
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to save product");
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Loading product data...</div>;

//   return (
//     <AdminLayout>
//       <div className="space-y-6 max-w-4xl">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold">
//               {isEdit ? "Edit Product" : "Add New Fishing Tool"}
//             </h1>
//             <p className="text-muted-foreground">
//               {isEdit
//                 ? "Update fishing tool details below"
//                 : "Fill in the fishing tool details below"}
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <Card>
//             <CardHeader>
//               <CardTitle>Fishing Tool Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Product Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label>Product Name *</Label>
//                   <Input
//                     value={formData.ProductName}
//                     onChange={(e) => setFormData({ ...formData, ProductName: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>SKU *</Label>
//                   <Input
//                     value={formData.SKU}
//                     onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Description *</Label>
//                 <Textarea
//                   rows={3}
//                   value={formData.Description}
//                   onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label>Specifications *</Label>
//                 <Textarea
//                   rows={3}
//                   value={formData.Specifications}
//                   onChange={(e) => setFormData({ ...formData, Specifications: e.target.value })}
//                   required
//                 />
//               </div>

//               {/* Price / Weight */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label>Price *</Label>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     value={formData.Price}
//                     onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div style={{ display: "none" }}>
//                   <Label>Compare at Price *</Label>
//                   <Input
//                     type="number"
//                     step="0.01"

//                     value={formData.CompareatPrice}
//                     onChange={(e) => setFormData({ ...formData, CompareatPrice: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Weight (oz) *</Label>
//                   <Input
//                     type="number"
//                     step="0.1"
//                     value={formData.Weight}
//                     onChange={(e) => setFormData({ ...formData, Weight: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Category / Stock */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label>Category *</Label>
//                   <Select
//                     value={formData.Category}
//                     onValueChange={(value) => setFormData({ ...formData, Category: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((cat) => (
//                         <SelectItem key={cat} value={cat}>
//                           {cat}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Stock Quantity *</Label>
//                   <Input
//                     type="number"
//                     value={formData.StockQuantity}
//                     onChange={(e) =>
//                       setFormData({ ...formData, StockQuantity: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Image */}
//               <div>
//                 <Label>Product Image *</Label>
//                 <div className="flex items-center gap-4">
//                   <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
//                   {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
//                   {formData.img3 && (
//                     <img
//                       src={formData.img3}
//                       alt="Preview"
//                       className="w-20 h-20 object-cover rounded border"
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="flex gap-4 pt-4">
//                 <Button type="submit" className="flex-1" disabled={uploading}>
//                   {uploading ? (
//                     <>
//                       <Upload className="w-4 h-4 mr-2 animate-spin" /> Uploading...
//                     </>
//                   ) : isEdit ? (
//                     "Update Product"
//                   ) : (
//                     "Add Fishing Tool"
//                   )}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate("/admin/products")}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ProductForm;



























// // import { useEffect, useState } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import AdminLayout from '@/components/admin/AdminLayout';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { ArrowLeft, Upload } from 'lucide-react';
// // import axios from 'axios';
// // import { toast } from 'sonner';

// // const ProductForm = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const isEdit = !!id;

// //   const [formData, setFormData] = useState({
// //     ProductName: '',
// //     SKU: '',
// //     Description: '',
// //     Specifications: '',
// //     Price: '',
// //     CompareatPrice: '',
// //     Weight: '',
// //     Category: '',
// //     StockQuantity: '',
// //     img3: '',
// //   });

// //   const [categories, setCategories] = useState<string[]>([]);
// //   const [uploading, setUploading] = useState(false);

// //   useEffect(() => {
// //     setCategories(['Rods', 'Reels', 'Hooks', 'Lures', 'Lines', 'Accessories']);
// //   }, []);

// //   // Handle Image Upload to Cloudinary
// //   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     setUploading(true);
// //     const formDataCloud = new FormData();
// //     formDataCloud.append('file', file);
// //     formDataCloud.append('upload_preset', 'images-zozac');

// //     try {
// //       const res = await axios.post('https://api.cloudinary.com/v1_1/dbq5gkepx/image/upload', formDataCloud);
// //       const imageUrl = res.data.secure_url;
// //       setFormData((prev) => ({ ...prev, img3: imageUrl }));
// //       toast.success('Image uploaded successfully');
// //     } catch (error) {
// //       console.error('Cloudinary upload failed:', error);
// //       toast.error('Image upload failed');
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     try {
// //       for (const key in formData) {
// //         if (!formData[key as keyof typeof formData]) {
// //           toast.error(`Please fill in ${key}`);
// //           return;
// //         }
// //       }

// //       const payload = {
// //         ProductName: formData.ProductName,
// //         SKU: formData.SKU,
// //         Description: formData.Description,
// //         Specifications: formData.Specifications,
// //         Price: parseFloat(formData.Price),
// //         CompareatPrice: parseFloat(formData.CompareatPrice),
// //         Weight: parseFloat(formData.Weight),
// //         Category: formData.Category,
// //         StockQuantity: parseInt(formData.StockQuantity),
// //         img3: formData.img3,
// //       };

// //       const response = await axios.post('https://realdealbackend.onrender.com/add', payload);

// //       if (response.status === 201) {
// //         toast.success('Fishing tool added successfully!');
// //         navigate('/admin/products');
// //       }
// //     } catch (error: any) {
// //       console.error(error);
// //       toast.error(error.response?.data?.message || 'Error adding fishing tool');
// //     }
// //   };

// //   return (
// //     <AdminLayout>
// //       <div className="space-y-6 max-w-4xl">
// //         <div className="flex items-center gap-4">
// //           <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
// //             <ArrowLeft className="w-4 h-4 mr-2" />
// //             Back
// //           </Button>
// //           <div>
// //             <h1 className="text-3xl font-bold">{isEdit ? 'Edit Product' : 'Add New Fishing Tool'}</h1>
// //             <p className="text-muted-foreground">Fill in the fishing tool details below</p>
// //           </div>
// //         </div>

// //         <form onSubmit={handleSubmit}>
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Fishing Tool Information</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-6">
// //               {/* Product Name & SKU */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="ProductName">Product Name *</Label>
// //                   <Input
// //                     id="ProductName"
// //                     value={formData.ProductName}
// //                     onChange={(e) => setFormData({ ...formData, ProductName: e.target.value })}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="SKU">SKU *</Label>
// //                   <Input
// //                     id="SKU"
// //                     value={formData.SKU}
// //                     onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Description */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="Description">Description *</Label>
// //                 <Textarea
// //                   id="Description"
// //                   rows={3}
// //                   value={formData.Description}
// //                   onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
// //                   required
// //                 />
// //               </div>

// //               {/* Specifications */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="Specifications">Specifications *</Label>
// //                 <Textarea
// //                   id="Specifications"
// //                   rows={3}
// //                   value={formData.Specifications}
// //                   onChange={(e) => setFormData({ ...formData, Specifications: e.target.value })}
// //                   required
// //                 />
// //               </div>

// //               {/* Price / Compare / Weight */}
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="Price">Price *</Label>
// //                   <Input
// //                     id="Price"
// //                     type="number"
// //                     step="0.01"
// //                     value={formData.Price}
// //                     onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="CompareatPrice">Compare at Price *</Label>
// //                   <Input
// //                     id="CompareatPrice"
// //                     type="number"
// //                     step="0.01"
// //                     value={formData.CompareatPrice}
// //                     onChange={(e) => setFormData({ ...formData, CompareatPrice: e.target.value })}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="Weight">Weight (oz) *</Label>
// //                   <Input
// //                     id="Weight"
// //                     type="number"
// //                     step="0.1"
// //                     value={formData.Weight}
// //                     onChange={(e) => setFormData({ ...formData, Weight: e.target.value })}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Category & Stock */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="Category">Category *</Label>
// //                   <Select
// //                     value={formData.Category}
// //                     onValueChange={(value) => setFormData({ ...formData, Category: value })}
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select category" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {categories.map((cat) => (
// //                         <SelectItem key={cat} value={cat}>
// //                           {cat}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="StockQuantity">Stock Quantity *</Label>
// //                   <Input
// //                     id="StockQuantity"
// //                     type="number"
// //                     value={formData.StockQuantity}
// //                     onChange={(e) => setFormData({ ...formData, StockQuantity: e.target.value })}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Image Upload */}
// //               <div className="space-y-3">
// //                 <Label>Product Image *</Label>
// //                 <div className="flex items-center gap-4">
// //                   <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
// //                   {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
// //                   {formData.img3 && (
// //                     <img
// //                       src={formData.img3}
// //                       alt="Preview"
// //                       className="w-20 h-20 object-cover rounded border"
// //                     />
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Submit */}
// //               <div className="flex gap-4 pt-4">
// //                 <Button type="submit" className="flex-1" disabled={uploading}>
// //                   {uploading ? (
// //                     <>
// //                       <Upload className="w-4 h-4 mr-2 animate-spin" /> Uploading...
// //                     </>
// //                   ) : (
// //                     isEdit ? 'Update Product' : 'Add Fishing Tool'
// //                   )}
// //                 </Button>
// //                 <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
// //                   Cancel
// //                 </Button>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </form>
// //       </div>
// //     </AdminLayout>
// //   );
// // };

// // export default ProductForm;











