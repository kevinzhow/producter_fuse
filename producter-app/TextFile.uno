using Uno;
using Uno.Collections;
using Fuse;
using Uno.UX;
using Fuse.Scripting;
using Fuse.Reactive;


public class TextFile: NativeModule
{
    readonly FileSource _file;
    [UXConstructor]
    public TextFile([UXParameter("File")] FileSource file)
    {
         AddMember(new NativeFunction("readSync", (NativeCallback)readSync));
        _file = file;
    }
    object readSync(Context c, object[] args)
    {
        return _file.ReadAllText();
    }
}
