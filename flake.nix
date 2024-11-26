{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, ... }: flake-utils.lib.eachSystem [ "aarch64-darwin" ] (system:  
  let pkgs = import nixpkgs {inherit system; }; in
  {
    devShells.default = pkgs.mkShell {
      name = "mio";
      packages = with pkgs; [ nodejs yarn ];
    };
  });
}
