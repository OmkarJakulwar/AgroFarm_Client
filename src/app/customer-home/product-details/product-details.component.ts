import { Component, Input, OnInit } from '@angular/core';
import { CustomerCart } from 'src/app/model/customerCart';
import { Product } from 'src/app/model/product';
import { CustomerHomeService } from '../customer-home.service';
import { CustomerHomeComponent } from '../customer-home.component';
import { Customer } from 'src/app/model/customer';
import { CartProduct } from 'src/app/model/cartProduct';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  @Input()
  selectedProduct!: Product;
  errorMessage!: string;
  successMessage!: string;
  productId: any;
  loggedInCustomer: any;
  router: any;

  constructor(private customerCommonService: CustomerHomeService, private custHome: CustomerHomeComponent) { }

  ngOnInit(): void {
    this.custHome.getCustomerCart();
  }

  addToCart() {

    this.successMessage = "";
    this.errorMessage = "";
    let alreadyAddedToCart: boolean = false;

    let cart: CustomerCart[] = JSON.parse(sessionStorage.getItem("cart") || "{}");
    if (cart == null) {
      cart = [];
    }


    let customer: Customer = JSON.parse(sessionStorage.getItem("customer") || "{}");
    const cartToAdd: CustomerCart = new CustomerCart();
    const cartProd: CartProduct = new CartProduct();
   

    let prod: Product = new Product();
    prod.productId = this.selectedProduct.productId;
    prod.name = this.selectedProduct.name;

    // Check if selectedProduct.quantity is initialized
    if (this.selectedProduct.quantity === undefined || this.selectedProduct.quantity === null) {
      // If not initialized, show an error message
      this.errorMessage = "Product quantity is not initialized. Please select a valid quantity.";
      return; // Exit function
  }
   
    prod.quantity = this.selectedProduct.quantity;


    cartProd.product = prod;
    cartProd.quantity = this.selectedProduct.quantity;

    cartToAdd.customerEmailId = customer.emailId;
    cartToAdd.cartProducts = [cartProd];

    cartToAdd.quantity = cartProd.quantity;

    if (cart.length > 0) {
      alreadyAddedToCart = (cart.filter(c => c.product.productId == this.selectedProduct.productId)).length != 0;
    }

    if (alreadyAddedToCart) {
      this.errorMessage = "Already added to Cart. Go to cart for modifying your selection."
    }
    else {
      setTimeout(() => {
      
      // add the selected item to the cart by calling addProductToCart() of CustomerHomeService,
      // set the success and error message appropriately
      this.customerCommonService.addProductToCart(cartToAdd).subscribe(
        
        (response) => {
          this.successMessage = "" + response;
        },
        (error) => {
          this.errorMessage = "Failed to add product to cart. Please try again later.";
          console.error('Error occurred while adding product to cart:', error);
        }
      )
      cart.push(cartToAdd);
      this.customerCommonService.updateCartList(cart);
      }, 1000);  
    }
  }

  incrementQuantity(): void {
    this.selectedProduct.quantity++;
    console.log(this.selectedProduct);
  }

  // Method to decrement the quantity
  decrementQuantity(): void {
    if (this.selectedProduct.quantity > 1) { // Ensure quantity doesn't go below 1
      this.selectedProduct.quantity--;
      console.log(this.selectedProduct);
    }
  }

  placeOrder(cart: CustomerCart[]) {
    this.router.navigate(["/home/placeOrder"]);
  }



}
