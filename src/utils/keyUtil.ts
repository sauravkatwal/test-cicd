class KeyUtil {
  private static instance: KeyUtil;
  constructor() {}

  static get(): KeyUtil {
    if (!KeyUtil.instance) {
      KeyUtil.instance = new KeyUtil();
    }
    return KeyUtil.instance;
  }

  public sqsTenantConnectionKey = ({workspaceSecret, sqsPurpose}: {workspaceSecret: string; sqsPurpose: string}) => `${workspaceSecret}-${sqsPurpose}`;
  
  public sesTenantConnectionKey = ({workspaceSecret, sesPurpose}: {workspaceSecret: string; sesPurpose: string}) => `${workspaceSecret}-${sesPurpose}`;
  
  public dbTenantConnectionKey = (workspaceSecret: string) => `${workspaceSecret}`;

}

const keyUtil = KeyUtil.get();

export { keyUtil as KeyUtil };
