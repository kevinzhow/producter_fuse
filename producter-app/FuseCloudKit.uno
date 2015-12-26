using Uno;
using Uno.Collections;
using Uno.UX;
using Fuse;
using Fuse.Scripting;
using Fuse.Reactive;
using global::iOS.Foundation;

public class FuseCloudKit : NativeModule
{
  extern(iOS)
  CloudKit cloudKit = new CloudKit();

  [UXConstructor]
  public FuseCloudKit() {
    debug_log("FuseCloudKit Created");
  }

}

extern(iOS)
public class CloudKit {
    // CKContainer defaultContainer = new CKContainer(CKContainer._defaultContainer());

    public CloudKit() {
      debug_log("CloudKit Created");
      // CKDatabase privateDB = defaultContainer.privateCloudDatabase();
    }

    // public void fetchUser() {
    //   var predicate = new NSPredicate(NSPredicate._predicateWithValue(true));
    //   var query = new CKQuery().initWithRecordTypePredicate("User", predicate);
    //
    //   privateDB.performQuery(query, null, (NSArray results, NSError error) => {
    //
    //   });
    // }
}
