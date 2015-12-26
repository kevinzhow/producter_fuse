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

  extern(iOS)
  Storage storage = new Storage();

  [UXConstructor]
  public FuseStoreKit() {
    AddMember(new NativeFunction("makeSubscribe", (NativeCallback)MakeSubscribe));
    AddMember(new NativeFunction("makeRestore", (NativeCallback)MakeRestore));
    AddMember(new NativeFunction("checkSubscribe", (NativeCallback)CheckSubscribe));
    AddMember(new NativeFunction("updateSubscribe", (NativeCallback)UpdateSubscribe));
  }

  object CheckSubscribe(Context c, object[] args)
  {
    if defined (iOS) {
      return storage.checkSubscribe();
    }
    return null;
  }

  object UpdateSubscribe(Context c, object[] args)
  {
    if defined (iOS) {
      debug_log(args);
      storage.updateSubscribe(true);
    }
    return null;
  }

  object MakeSubscribe(Context c, object[] args) {
    if defined (iOS) {
      Subscribe();
    }
    return null;
   }

   object MakeRestore(Context c, object[] args) {
     if defined (iOS) {
       Restore();
     }
     return null;
    }
   //
  //  public bool CanMakePayments()
  //   {
  //     return SKPaymentQueue._canMakePayments;
  //   }

   public void Subscribe() {
     if defined(iOS) {
       // Make sure platform code inside define or fuse porxy may not work
       if (SKPaymentQueue._canMakePayments()) {
         debug_log("Can Make Payment");
         storeKit.makeSubscribe();
       } else {
         debug_log("Can not make payment");
       }
     }
   }

   public void Restore() {
     if defined(iOS) {
       // Make sure platform code inside define or fuse porxy may not work
       if (SKPaymentQueue._canMakePayments()) {
         debug_log("Can Make Payment");
         storeKit.makeRestore();
       } else {
         debug_log("Can not make payment");
       }
     }
   }
}

extern(iOS)
public class Storage {

    NSUserDefaults userDefaults = new NSUserDefaults(NSUserDefaults._standardUserDefaults());

    public Storage() {
      debug_log("Storage Created");
    }

    public bool checkSubscribe() {
      return userDefaults.boolForKey("Subscribe");
    }

    public void updateSubscribe(bool subscribe) {
      userDefaults.setBoolForKey(subscribe, "Subscribe");
    }
}

extern(iOS)
public class StoreKit: ISKProductsRequestDelegate, ISKPaymentTransactionObserver {

    Storage storage;

    public StoreKit() {
      storage = new Storage();
      debug_log("StoreKit Created");
      var subscribeStatus = storage.checkSubscribe();
      debug_log(subscribeStatus);
    }

    public void makeSubscribe() {
      debug_log("App Store Kit Can Make Payment");

      SKPayment payment = new SKPayment(SKPayment._paymentWithProductIdentifier("producter_month_subscribe"));
      var defaultQueue = new SKPaymentQueue(SKPaymentQueue._defaultQueue());
      defaultQueue.addTransactionObserver(this);
      defaultQueue.addPayment(payment);

      //  NSString begin = new NSString();
      //  begin.initWithString("producter_month_subscribe");
       //
      //  debug_log(begin);
       //
      //  NSArray productArrary = new NSArray();
      //  productArrary.init();
      //  productArrary = productArrary.arrayByAddingObject(begin);
       //
      //  NSSet productSet = new NSSet();
      //  productSet.initWithArray(productArrary);
       //
      //  debug_log(productSet);
       //
      //  SKProductsRequest request = new SKProductsRequest();
      //  request.initWithProductIdentifiers(productSet);
       //
      //  request.setDelegate(this);
      //  request.start();
    }

    public void productsRequestDidReceiveResponse(SKProductsRequest request, SKProductsResponse response) {
      debug_log("Recieve Product Response");
    }

    public void paymentQueueUpdatedTransactions(SKPaymentQueue queue, NSArray transactions) {
      debug_log("Payment queue update");

      int count = (int)transactions.count();
      for (int i = 0; i < count; i++) {
        SKPaymentTransaction transaction =  new SKPaymentTransaction(transactions.objectAtIndex(i));
        debug_log(transaction.transactionState());
        var state = transaction.transactionState();
        if (state == 1) {
          storage.updateSubscribe(true);
        } else {
          storage.updateSubscribe(false);
        }
        debug_log(transaction.error());
      }
    }

    public void makeRestore(){
      debug_log(" ** Restore");
      // theObserver will be notified of when the restored transactions start arriving <- AppStore
      var defaultQueue = new SKPaymentQueue(SKPaymentQueue._defaultQueue());
      defaultQueue.restoreCompletedTransactions();
    }

    public void paymentQueueRestoreCompletedTransactionsFinished (SKPaymentQueue queue) {
          // Restore succeeded
      storage.updateSubscribe(true);
      debug_log(" ** RESTORE PaymentQueueRestoreCompletedTransactionsFinished");
    }

    public void paymentQueueRemovedTransactions(SKPaymentQueue queue, NSArray transactions) {

    }

    public void paymentQueueRestoreCompletedTransactionsFailedWithError (SKPaymentQueue queue, NSError error)
    {
      // Restore failed somewhere...
      storage.updateSubscribe(false);
      debug_log(" ** RESTORE RestoreCompletedTransactionsFailedWithError");
    }
}
