const Products = require('../models/productModel');

//Filter, sorting and pagination
class APIfeatures {
	constructor(query, queryString) {
		(this.query = query), (this.queryString = queryString);
	}
	filtering() {
		const queryObj = { ...this.queryString };
		//queryString=req.query
		console.log({ before: queryObj }); //Before delete page , sort

		const excludedFields = ['page', 'sort', 'limit'];
		excludedFields.forEach((el) => delete queryObj[el]);

		console.log({ after: queryObj }); //After delete page , sort

		//Stringify => JSON
		let queryStr = JSON.stringify(queryObj);

		//Regex
		//gte => greater than or equal
		//lte => lesser than or equal
		//gt => greater than
		//lt => lesser than
		//regex => contain string
		queryStr = queryStr.replace(
			/\b(gte|gt|lt|lte|regex)\b/g,
			(match) => '$' + match
		);
		console.log({ queryStr });

		this.query.find(JSON.parse(queryStr));

		return this;
	}
	sorting() {
		//Get property sort
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join('');
			// console.log(sortBy);

			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		//example number
		//sort=price => asc
		//sort=-price =>desc

		//example string
		//sort=title => asc letter
		return this;
	}
	paginating() {
		//Get page and limit item
		//If > limit => skip new page
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 3;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

const productCtrl = {
	getProducts: async (req, res) => {
		try {
			//Get query String in here
			const features = new APIfeatures(Products.find(), req.query)
				.filtering()
				.sorting()
				.paginating();
			const products = await features.query;

			res.json({
				status: 'success',
				result: products.length,
				products
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	createProduct: async (req, res) => {
		try {
			const {
				product_id,
				title,
				price,
				description,
				content,
				images,
				category
			} = req.body;
			if (!images)
				return res
					.status(400)
					.json({ msg: 'No images upload.You need upload images.Opps' });

			const product = await Products.findOne({ product_id });
			if (product)
				return res.status(400).json({ msg: 'This product already exists.' });
			const newProduct = new Products({
				product_id,
				title: title.toLowerCase(),
				price,
				description,
				content,
				images,
				category
			});
			await newProduct.save();
			res.json({ msg: 'Created a New Product' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	deleteProduct: async (req, res) => {
		try {
			await Products.findByIdAndDelete(req.params.id);
			res.json({ msg: 'Deleted a Product' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateProduct: async (req, res) => {
		try {
			const { title, price, description, content, images, category } = req.body;
			if (!images)
				return res
					.status(400)
					.json({ msg: 'No images upload.You need upload images.Opps' });

			await Products.findOneAndUpdate(
				{ _id: req.params.id },
				{
					title: title.toLowerCase(),
					price,
					description,
					content,
					images,
					category
				}
			);

			res.json({ msg: 'The product updated!' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = productCtrl;
