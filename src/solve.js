// const solve = 

class Mat{
    constructor(data, mirror){
        this.data = new Array(data.length);
        for (var i=0, cols=data[0].length; i<data.length; i++) {
            this.data[i] = new Array(cols);
            for(var j=0; j<cols; j++) {
              this.data[i][j] = data[i][j];
            }
          }
        if (mirror) {
            if (typeof mirror[0] !== "object") {
                for (var i=0; i<mirror.length; i++) {
                mirror[i] = [mirror[i]];
                }
            }
            this.mirror = new Mat(mirror);
        }
    }
    swap(i, j) {
        if (this.mirror) this.mirror.swap(i,j);
        var tmp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = tmp;
      }
    multline (i, l) {
        if (this.mirror) this.mirror.multline(i,l);
        var line = this.data[i];
        for (var k=line.length-1; k>=0; k--) {
          line[k] *= l;
        }
      }  
    addmul (i, j, l) {
        if (this.mirror) this.mirror.addmul(i,j,l);
        var lineI = this.data[i], lineJ = this.data[j];
        for (var k=lineI.length-1; k>=0; k--) {
          lineI[k] = lineI[k] + l*lineJ[k];
        }
      }
    hasNullLine (i) {
        for (var j=0; j<this.data[i].length; j++) {
          if (this.data[i][j] !== 0) {
            return false;
          }
        }
        return true;
      }
    gauss () {
        var pivot = 0,
            lines = this.data.length,
            columns = this.data[0].length,
            nullLines = [];
      
        for (var j=0; j<columns; j++) {
          // Find the line on which there is the maximum value of column j
          var maxValue = 0, maxLine = 0;
          for (var k=pivot; k<lines; k++) {
            var val = this.data[k][j];
            if (Math.abs(val) > Math.abs(maxValue)) {
              maxLine = k;
              maxValue = val;
            } 
          }
          if (maxValue === 0) {
            // The matrix is not invertible. The system may still have solutions.
            nullLines.push(pivot);
          } else {
            // The value of the pivot is maxValue
            this.multline(maxLine, 1/maxValue);
            this.swap(maxLine, pivot);
            for (var i=0; i<lines; i++) {
              if (i !== pivot) {
                this.addmul(i, pivot, -this.data[i][j]);
              }
            }
          }
          pivot++;
        }
        for (var i=0; i<nullLines.length; i++) {
            if (!this.mirror.hasNullLine(nullLines[i])) {
              throw new Error("singular matrix");
            }
          }
          return this.mirror.data;
    }

}

function solve (A, b) {
    var result = new Mat(A,b).gauss();
    if (result.length > 0 && result[0].length === 1) {
      // Convert Nx1 matrices to simple javascript arrays
      for (var i=0; i<result.length; i++) result[i] = result[i][0];
    }
    return result;
  }


  export default solve;

  // console.log(solve([[ 1, 2],[ 3, 3]], [23, 48])) => [9, 7]