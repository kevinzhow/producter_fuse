using Uno;
using Uno.Collections;
using Uno.UX;
using Fuse;
using Fuse.Scripting;
using Fuse.Reactive;
using global::iOS.StoreKit;
using global::iOS.Foundation;

public class FuseStoreKit : NativeModule
{

  extern(iOS)
  StoreKit storeKit = new StoreKit();

  public FuseStoreKit() {
    // SKPaymentQueue._defaultQueue.addTransactionObserver(this);
    AddMember(new NativeFunction("makeSubscribe", (NativeCallback)MakeSubscribe));
  }

  object MakeSubscribe(Context c, object[] args)
   {
       if defined (iOS)
       {
         Subscribe();
       }
       return null;
   }
   //
  //  public bool CanMakePayments()
  //   {
  //     return SKPaymentQueue._canMakePayments;
  //   }

   public void Subscribe() {
     if (true) {
       debug_log("Can Make Payment");
       storeKit.makeSubscribe();
     } else {
       debug_log("Can not make payment");
     }
   }
}

extern(iOS) public class StoreKit: ISKProductsRequestDelegate, ISKPaymentTransactionObserver {

    public StoreKit() {
       debug_log("StoreKit Created");
       SKPaymentQueue._defaultQueue.addTransactionObserver(this);
    }

    public void makeSubscribe() {
       debug_log("App Store Kit Can Make Payment");
    }

    public void productsRequestDidReceiveResponse(SKProductsRequest request,SKProductsResponse response) {

    }

    public void paymentQueueUpdatedTransactions(SKPaymentQueue queue, NSArray transactions) {

    }
}
