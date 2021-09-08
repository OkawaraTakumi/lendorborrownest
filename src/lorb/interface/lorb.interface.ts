interface BoxContents {
  LorBState: number;
  negotiateItem: string;
  negotiateDetail: '';
  userForApprove: string;
  title: string;
  detailClass: string;
  aboutDetail: string;
}

interface LorB {
  LorBBox: Array<BoxContents>;
  userTo: string;
  userToName: string;
  userFrom: string;
  userFromName: string;
}
