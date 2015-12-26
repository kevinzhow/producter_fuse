using Uno;
using Uno.Collections;
using Uno.UX;
using Fuse;
using Fuse.Scripting;
using Fuse.Reactive;
using global::iOS.Foundation;

public class FuseStorageKit : NativeModule
{
  extern(iOS)
  Storage storage = new Storage();

  public FuseStorageKit() {
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

}

extern(iOS) public class Storage {

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
